// @unocss-include
import type { DefineComponent, VNode } from 'vue'
import { defineComponent, h, reactive, ref, watch, watchEffect } from 'vue'
import type { FormRules } from 'element-plus'
import { ElCascader, ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElDatePicker, ElForm, ElFormItem, ElIcon, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioButton, ElRadioGroup, ElSelect, ElSwitch, ElUpload } from 'element-plus'
import { findElement, sortByOrder } from 'simon-js-tool'
import { Plus } from '@element-plus/icons-vue'
import type { Schema, TypeComponent } from './types'

export const jsonSchemaTransformForm = defineComponent({
  props: {
    schema: {
      type: Object,
      default: () => { },
    },
  },
  setup(props, { expose }) {
    const schema = ref(props.schema)
    const model = ref<Record<string, any>>({})
    const rules = reactive<FormRules>({})
    const formEl = ref<HTMLFormElement>()
    const errors = ref([])
    const styles = ref('')
    watch(props, () => {
      schema.value = props.schema
    })
    watch(schema, () => {
      model.value = {}
    })
    expose({
      getFormData: () => model.value,
      submit: () => new Promise((resolve) => {
        formEl.value!.validate((valid: boolean) => {
          resolve(valid && model.value)
          const class0 = errors.value[0]
          if (!class0)
            return
          const el = findElement(`.${class0}`)
          if (!el)
            return
          el.scrollIntoView({ behavior: 'smooth' })
        })
      }),
      resetField: () => formEl.value!.resetFields(),
    })
    return () => schema.value
      ? h('div', {
        style: {
          textAlign: 'left',
        },
      }, [
        h('h3', {
          class: 'text-2xl mb-2',
        }, props.schema.name),
        h('h1', {
          class: 'text-sm mb-3',
        }, props.schema.description),
        h(ElForm, {
          ref: formEl,
          model: model.value,
          rules,
          size: props.schema.size,
          class: props.schema.class,
        }, { default: () => renderForm(props.schema.attribs) })])
      : ''

    function renderForm(form: Record<string, any>) {
      const formList: VNode[] = []
      for (const key in form) {
        const { default: value, type, size, limit = 1, cascaderType, colorTitle, json, label, rules: itemRules, required, class: className, position, style, description, show, maxlength, minlength, options, min, max, disabled, border, precision, step, debounce = 300, placeholder, children } = form[key]
        const formItemClass = `json_${type + key}`
        watchEffect(judgeShow, {
          flush: 'post',
        })
        errors.value = []
        if (value !== undefined)
          model.value[key] = value || ''
        if (itemRules) {
          rules[key] = [
            {
              validator: (o, value = '', callback) => {
                Object.keys(itemRules).forEach((rule) => {
                  const errMsg = itemRules[rule]
                  const reg = new RegExp(rule)
                  if (!reg.test(value)) {
                    if (!errors.value.includes(formItemClass))
                      errors.value.push(formItemClass)
                    return callback(
                      new Error(errMsg || `${key} is invalid`),
                    )
                  }
                  else if (errors.value.includes(formItemClass)) { errors.value.splice(errors.value.indexOf(formItemClass), 1) }
                })
                callback()
              },
            },
          ]
        }
        else if (required) {
          rules[key] = [
            {
              validator: (o, value, callback) => {
                if (value !== undefined) {
                  if (!errors.value.includes(formItemClass))
                    errors.value.push(formItemClass)
                  return callback(
                    new Error(`${key} is required`),
                  )
                }
                callback()
              },
            },
          ]
        }
        const typeComponent: TypeComponent = {
          Text: (type = 'text') => h(ElInput, {
            'modelValue': model.value[key],
            'class': className,
            style,
            maxlength,
            minlength,
            type,
            placeholder,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          Email: () => typeComponent.Text(),
          RichText: () => typeComponent.Text('textarea'),
          Password: () => typeComponent.Text('password'),
          Date: () => h(ElDatePicker, {
            'modelValue': model.value[key],
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          Number: () => h(ElInputNumber, {
            'modelValue': model.value[key] || 0,
            'class': className,
            style,
            disabled,
            min,
            max,
            precision,
            step,
            'onUpdate:modelValue': modelValue,
          }),
          Enumeration: () => h(ElSelect, {
            'modelValue': model.value[key],
            'class': className,
            style,
            placeholder,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (options || []).map((item: any) => h(ElOption, { value: item?.value, label: item?.label, disabled: item?.disabled || false })),
          }),
          Boolean: () => h(ElSwitch, {
            'modelValue': model.value[key] || (model.value[key] = false),
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          Radio: (type = 'radio') => h(ElRadioGroup, {
            'modelValue': model.value[key],
            'class': className,
            style,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (options || []).map((item: any) => h(type === 'radio'
              ? ElRadio
              : ElRadioButton, { label: item?.value, disabled: item.disabled, border }, { default: () => item?.label })),
          }),
          Checkbox: (type = 'checkbox') => h(ElCheckboxGroup, {
            'modelValue': model.value[key] || [],
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (options || []).map((item: any) => h(type === 'checkbox'
              ? ElCheckbox
              : ElCheckboxButton, { label: item?.value, disabled: item?.disabled, border }, { default: () => item?.label })),
          }),
          CheckboxButton: () => typeComponent.Checkbox('checkboxButton'),
          RadioButton: () => typeComponent.Radio('radioButton'),
          Cascader: () => h(ElCascader, {
            'modelValue': model.value[key] || [],
            'class': className,
            'options': json?.options || [],
            debounce,
            style,
            disabled,
            'props': {
              multiple: cascaderType,
            },
            placeholder,
            'filterable': true,
            'onUpdate:modelValue': modelValue,
            'collapse-tags-tooltip': true,
          }),
          Upload: () => h(ElUpload, {
            'fileList': model.value[key] || [],
            'class': className,
            'listType': 'picture-card',
            'action': '#',
            'autoUpload': false,
            limit,
            style,
            disabled,
            'onChange': uploadChange,
            'onRemove': removeFile,
            placeholder,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => {
              return h(ElIcon, null, { default: () => h(Plus) })
            },
          }),
        }
        if (!type)
          throw new Error(`type is required in ${form}`)
        if (colorTitle) {
          styles.value += `
          .${formItemClass} .el-form-item__label{
            color:${colorTitle};
          }
          `
        }
        formList.push(h(ElFormItem, {
          label,
          prop: key,
          required: !!required,
          class: formItemClass,
          position,
          size,
        }, {
          default: () => [h('div', {
            class: ' w-full text-1 lh-4 text-gray-600:50 mb-1',
          }, description), typeComponent[type as keyof TypeComponent]()],
        }))
        if (children)
          formList.push(...renderForm(children))
        function uploadChange(data: any) {
          model.value[key] = model.value[key] || []
          model.value[key].push(data)
        }
        function removeFile(data: any) {
          model.value[key].splice(data, 1)
        }
        function modelValue(val: any) {
          model.value[key] = val
        }
        function judgeShow() {
          const el = document.querySelector(`.${formItemClass}`)! as HTMLElement
          if (!el)
            return
          if (!show)
            return el.style.display = 'block'
          for (const key in show) {
            const value = model.value[key]
            const data = show[key]
            const datavalue = data.value
            if (datavalue && value !== datavalue)
              return el.style.display = 'none'

            const rules = data.rules
            if (rules) {
              for (const rule of rules) {
                const reg = new RegExp(rule)
                if (!reg.test(value))
                  return el.style.display = 'none'
              }
            }
          }

          return el.style.display = 'block'
        }
      }
      return sortByOrder(formList, schema.value.order, 'props.prop')
    }
  },
}) as DefineComponent<{ schema: Schema }, {}, { getFormData: () => Record<string, any>; submit: () => Promise<boolean | Record<string, any>> }>
