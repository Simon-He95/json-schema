// @unocss-include
import type { DefineComponent, VNode } from 'vue'
import { defineComponent, h, reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { ElCheckbox, ElCheckboxGroup, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioGroup, ElSelect, ElSwitch } from 'element-plus'
import type { TypeComponent } from './types'

export const jsonSchemaTransformForm = defineComponent({
  props: {
    schema: {
      type: Object,
      default: () => { },
    },
  },
  setup(props, { expose }) {
    const model = reactive<Record<string, any>>({})
    const rules = reactive<FormRules>({})
    expose({
      getFormData: () => model,
    })
    return () => h('div', [
      h('h3', {
        class: 'text-2xl mb-2',
      }, props.schema.title),
      h('h1', {
        class: 'text-sm mb-3',
      }, props.schema.description),
      h(ElForm, {
        model,
        rules,
        class: props.schema.class,
      }, { default: () => sortForm(renderForm(props.schema.form)) })])

    function renderForm(form: Record<string, any>) {
      const formList: any[] = []
      for (const key in form) {
        const { default: value, type, title, rule, class: className, style, description, show, maxlength, min, max } = form[key]
        if (value !== undefined)
          model[key] = value || ''
        if (typeof rule === 'object') {
          rules[key] = [{
            required: true,
            validator: (o, value, callback) => {
              for (const key in rule) {
                if (!new RegExp(key).test(value))
                  return callback(new Error(rule[key]))
              }
              callback()
            },
            trigger: 'blur',
          }]
        }
        else if (rule) { rules[key] = [{ required: true, message: rule }] }
        const typeComponent: TypeComponent = {
          string: (type = 'text') => h(ElInput, {
            'modelValue': model[key] || '',
            'class': className,
            style,
            maxlength,
            type,
            'onUpdate:modelValue': modelValue,
          }),
          password: () => typeComponent.string('password'),
          datepicker: () => h(ElDatePicker, {
            'modelValue': model[key],
            'class': className,
            style,
            'onUpdate:modelValue': modelValue,
          }),
          number: () => h(ElInputNumber, {
            'modelValue': model[key] || 0,
            'class': className,
            style,
            min,
            max,
            'onUpdate:modelValue': modelValue,
          }),
          select: () => h(ElSelect, {
            'modelValue': model[key],
            'class': className,
            style,
            'onUpdate:modelValue': modelValue,
          },
          { default: () => (form[key]?.options || []).map((item: any, i: number) => h(ElOption, { value: form[key]?.values?.[i] || i, label: item })) },
          ),
          switch: () => h(ElSwitch, {
            'modelValue': model[key] || 0,
            'class': className,
            style,
            'onUpdate:modelValue': modelValue,
          }),
          radio: () => h(ElRadioGroup, {
            'modelValue': model[key] || 0,
            'class': className,
            style,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (form[key]?.options || []).map((item: any, i: number) => h(ElRadio, { label: form[key]?.values?.[i] || item }, { default: () => item })),
          }),
          checkbox: () => h(ElCheckboxGroup, {
            'modelValue': model[key] || [],
            'class': className,
            style,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (form[key]?.options || []).map((item: any, i: number) => h(ElCheckbox, { label: form[key]?.values?.[i] || item }, { default: () => item })),
          }),
        }
        if (!show || model[show]) {
          formList.push(h(ElFormItem, {
            label: title,
            prop: key,
            style: {
              display: 'block',
            },
          }, {
            default: () => [h('div', {
              class: ' w-full text-1 lh-4 text-gray-600:50 mb-1',
            }, description), typeComponent[type as keyof TypeComponent]()],
          }))
        }
        function modelValue(val: any) {
          model[key] = val
        }
      }
      return formList
    }

    function sortForm(formList: VNode[]) {
      const order: string[] = props.schema.order
      if (order) {
        const newFormList: VNode[] = []
        let insertIndex
        order.forEach((key, idx) => {
          if (key === '*')
            return insertIndex = idx

          const index = formList.findIndex(item => item?.props?.prop === key)
          if (index !== -1) {
            newFormList.push(formList[index])
            formList.splice(index, 1)
          }
        })
        if (insertIndex !== undefined)
          newFormList.splice(insertIndex, 0, ...formList)
        else
          newFormList.concat(formList)
        return newFormList
      }
      return formList
    }
  },
}) as DefineComponent<{ schema: Record<string, any> }, {}, { getFormData: () => Record<string, any> }>
