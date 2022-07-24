import type { DefineComponent } from 'vue'
import { defineComponent, h, reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { ElCheckbox, ElCheckboxGroup, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioGroup, ElSelect, ElSwitch } from 'element-plus'
import type { TypeComponent } from './types'

export const mySchema = defineComponent({
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
    return () => h(ElForm, {
      model,
      rules,
      labelWidth: '120px',
      class: props.schema.class,
    }, { default: () => renderForm(props.schema.form) })

    function renderForm(form: Record<string, any>) {
      const formList: any[] = []
      for (const key in form) {
        const { default: value, type, title, rule, class: className } = form[key]
        if (rule ?? value)
          model[key] = value || ''
        if (rule) {
          if (typeof rule === 'function')
            rules[key] = [{ required: true, validator: rule }]
          else
            rules[key] = [{ required: true, message: rule }]
        }
        const typeComponent: TypeComponent = {
          string: () => h(ElInput, {
            'modelValue': model[key],
            'class': className,
            'onUpdate:modelValue': val => model[key] = val,
          }),
          datepicker: () => h(ElDatePicker, {
            'modelValue': model[key],
            'class': className,
            'onUpdate:modelValue': (e: any) => model[key] = e,
          }),
          number: () => h(ElInputNumber, {
            'modelValue': model[key] || 0,
            'class': className,
            'onUpdate:modelValue': (e: any) => model[key] = +e,
          }),
          select: () => h(ElSelect, {
            'modelValue': model[key],
            'class': className,
            'onUpdate:modelValue': (e: any) => model[key] = e,
          },
          { default: () => (form[key]?.options || []).map((item: any, i: number) => h(ElOption, { value: form[key]?.values?.[i] || i, label: item })) },
          ),
          switch: () => h(ElSwitch, {
            'modelValue': model[key] || 0,
            'onUpdate:modelValue': (e: any) => model[key] = e,
          }),
          radio: () => h(ElRadioGroup, {
            'modelValue': model[key] || 0,
            'class': className,
            'onUpdate:modelValue': (e: any) => model[key] = e,
          }, {
            default: () => (form[key]?.options || []).map((item: any, i: number) => h(ElRadio, { label: form[key]?.values?.[i] || item }, { default: () => item })),
          }),
          checkbox: () => h(ElCheckboxGroup, {
            'modelValue': model[key] || [],
            'class': className,
            'onUpdate:modelValue': (e: any) => model[key] = e,
          }, {
            default: () => (form[key]?.options || []).map((item: any, i: number) => h(ElCheckbox, { label: form[key]?.values?.[i] || item }, { default: () => item })),
          }),
        }
        formList.push(h(ElFormItem, {
          label: title,
          prop: key,
        }, {
          default: typeComponent[type as keyof TypeComponent],
        }))
      }
      return formList
    }
  },
}) as DefineComponent<{ schema: Record<string, any> }, {}, { getFormData: () => Record<string, any> }>
