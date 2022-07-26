// @unocss-include
import type { DefineComponent, VNode } from 'vue'
import { defineComponent, h, reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { ElCascader, ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioButton, ElRadioGroup, ElSelect, ElSwitch } from 'element-plus'
import { sortByOrder } from 'simon-js-tool'
import type { Schema, TypeComponent } from './types'

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
    const formEl = ref<HTMLFormElement>()
    expose({
      getFormData: () => model,
      submit: () => new Promise((resolve) => {
        formEl.value!.validate((valid: boolean) => resolve(valid && model))
      }),
    })
    return () => h('div', [
      h('h3', {
        class: 'text-2xl mb-2',
      }, props.schema.title),
      h('h1', {
        class: 'text-sm mb-3',
      }, props.schema.description),
      h(ElForm, {
        ref: formEl,
        model,
        rules,
        size: props.schema.size,
        class: props.schema.class,
      }, { default: () => sortByOrder(renderForm(props.schema.form), props.schema.order, 'props.prop') })])

    function renderForm(form: Record<string, any>) {
      const formList: VNode[] = []
      for (const key in form) {
        const { default: value, type, title, rule, class: className, style, description, show, maxlength, minlength, options, values, min, max, disabled, disables, border, precision, step, debounce = 300, placeholder, children } = form[key]
        const isShow = judgeShow()
        if (value !== undefined && isShow)
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
            'modelValue': model[key],
            'class': className,
            style,
            maxlength,
            minlength,
            type,
            placeholder,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          textarea: () => typeComponent.string('textarea'),
          password: () => typeComponent.string('password'),
          datepicker: () => h(ElDatePicker, {
            'modelValue': model[key],
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          number: () => h(ElInputNumber, {
            'modelValue': model[key] || 0,
            'class': className,
            style,
            disabled,
            min,
            max,
            precision,
            step,
            'onUpdate:modelValue': modelValue,
          }),
          select: () => h(ElSelect, {
            'modelValue': model[key],
            'class': className,
            style,
            disabled,
            placeholder,
            'onUpdate:modelValue': modelValue,
          },
          { default: () => (options || []).map((item: any, i: number) => h(ElOption, { value: values?.[i] || i, label: item })) },
          ),
          switch: () => h(ElSwitch, {
            'modelValue': model[key] || 0,
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          radio: (type = 'radio') => h(ElRadioGroup, {
            'modelValue': model[key],
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (options || []).map((item: any, i: number) => h(type === 'radio'
              ? ElRadio
              : ElRadioButton, { label: values?.[i] || item, disabled: disables?.[i], border }, { default: () => item })),
          }),
          checkbox: (type = 'checkbox') => h(ElCheckboxGroup, {
            'modelValue': model[key] || [],
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (form[key]?.options || []).map((item: any, i: number) => h(type === 'checkbox'
              ? ElCheckbox
              : ElCheckboxButton, { label: values?.[i] || item, disabled: disables?.[i], border }, { default: () => item })),
          }),
          checkboxButton: () => typeComponent.checkbox('checkboxButton'),
          radioButton: () => typeComponent.radio('radioButton'),
          cascader: () => h(ElCascader, {
            'modelValue': model[key] || [],
            'class': className,
            options,
            debounce,
            style,
            disabled,
            placeholder,
            'filterable': true,
            'onUpdate:modelValue': modelValue,
          }),
        }
        if (!type)
          throw new Error(`type is required in ${form}`)
        formList.push(h(ElFormItem, {
          label: title,
          prop: key,
          style: {
            display: isShow
              ? 'block'
              : 'none',
          },
        }, {
          default: () => [h('div', {
            class: ' w-full text-1 lh-4 text-gray-600:50 mb-1',
          }, description), typeComponent[type as keyof TypeComponent]()],
        }))
        if (children)
          formList.push(...renderForm(children))

        function modelValue(val: any) {
          model[key] = val
        }
        function judgeShow() {
          if (!show)
            return true
          let showValue = true
          show?.replace(/{{\s{0,}([\w.>]+)\s{0,}}}(.*)/, (e: any, r: any, q: any) => {
            const val = r.split('.').reduce((o: any, k: string) => o[k], model)
            try {
              showValue = eval(val + q)
            }
            catch (error) {
              showValue = eval(String(!!val))
            }
            return showValue
          })
          return showValue
        }
      }
      return formList
    }
  },
}) as DefineComponent<{ schema: Schema }, {}, { getFormData: () => Record<string, any>; submit: () => Promise<boolean | Record<string, any>> }>
