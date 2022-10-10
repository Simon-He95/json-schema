// @unocss-include
import type { DefineComponent, VNode } from 'vue'
import { defineComponent, h, reactive, ref, watch, watchEffect } from 'vue'
import type { FormRules } from 'element-plus'
import { ElButton, ElCascader, ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElCollapse, ElCollapseItem, ElDatePicker, ElForm, ElFormItem, ElIcon, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioButton, ElRadioGroup, ElSelect, ElSwitch, ElUpload } from 'element-plus'
import { addStyle, findElement, sortByOrder } from 'simon-js-tool'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { Schema, TypeComponent } from './types'

// todo Tabs
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
    const errors = ref<string[]>([])
    let styles = ''
    const formList = [] as VNode[]
    let stop: () => void

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
          const el = findElement(`.${class0}`) as HTMLElement
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
        }, { default: () => renderForm(props.schema.attribs, model.value) })])
      : ''

    function renderForm(form: Record<string, any>, _model: any, pKey = '', index = 0) {
      formList.length = 0
      errors.value.length = 0
      for (const key in form) {
        const { type } = form[key]
        if (type === 'Group')
          formList.push(renderGroup(key, form) as any)
        else
          formList.push(renderField(form, _model, key, pKey, index) as any)
      }
      if (stop)
        stop?.()
      stop = addStyle(styles)
      return sortByOrder(formList, schema.value.order, 'props.prop')
    }

    function renderGroup(pKey: string, form: Record<string, any>): VNode[] {
      const { label, children } = form[pKey]
      const formItemClass = `json_group_${pKey}`
      model.value[pKey] = model.value[pKey] || []
      const groupClass = `${formItemClass}_${pKey}`
      styles += `.${groupClass} .el-collapse-item__content { padding-bottom: 0 ; }`
      debugger
      return model.value[pKey].length
        ? h('div', {
          props: pKey,
        }, [
          h(ElCollapse, {
            style: 'border-bottom:none',
            class: groupClass,
            modelValue: '1',
          }, h(ElCollapseItem, {
            name: '1',
          }, {
            title: () => h('div', label),
            default: () => model.value[pKey].map((item: any, index: number) =>
              h('div', {
                style: 'position:relative',
              }, [
                renderForm(children, model.value[pKey][index], pKey, index),
                h(Delete, {
                  style: 'position:absolute;top:0;right:0;width: 1em; height: 1em; margin-right: 8px',
                  onClick: () => model.value[pKey].splice(index, 1),
                }),
              ]),
            ),
          })), h(ElButton, {
            size: 'large',
            style: 'margin-bottom:20px;width:100%;',
            onClick: () => {
              model.value[pKey].push({})
            },
          }, {
            default: () => '新增',
          })]) as any
        : h('div', {
          style: 'width:200px;cursor:pointer;margin-bottom:20px;box-shadow: rgb(33 33 52 / 10%) 0px 1px 4px;padding: 12px 16px;border-color: rgb(234, 234, 239);border-radius:26px;text-align:center;color: rgb(142, 142, 169);font-size:0.75rem;',
          onClick: () => {
            model.value[pKey].push({})
          },
        }, {
          default: () => '创建Group',
        })
    }

    function renderField(obj: Record<string, any>, _model: any, key: string, pKey = '', index = 0) {
      const { default: value, type, size, limit = 1, colorTitle, label, rules: itemRules, multiple = false, required, class: className, position, style, description, show, maxlength, minlength, options = [], min, max, disabled, border, precision, step, debounce = 300, placeholder } = obj[key]
      const formItemClass = pKey
        ? `json_${`${pKey + index}_${key}`}`
        : `json_${`${type}_${key}`}`

      if (!type)
        throw new Error(`type is required in ${obj}`)
      if (colorTitle) {
        styles += `
          .${formItemClass} .el-form-item__label{
            color:${colorTitle};
          }
          `
      }
      else {
        styles += `
            .el-form-item .el-form-item{
              margin-bottom:22px;
            }
          `
      }
      watchEffect(judgeShow, {
        flush: 'post',
      })
      if (value !== undefined)
        _model[key] = value || ''

      if (itemRules) {
        if (pKey) {
          rules[`${pKey}[${index}]${key}`] = [
            {
              required: !!required,
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
        else {
          rules[key] = [
            {
              required: !!required,
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
      }
      else if (required) {
        if (pKey) {
          rules[`${pKey}[${index}]${key}`] = [
            {
              required: !!required,
              validator: (o, _, callback) => {
                const value = _model[key]
                if (!value) {
                  if (!errors.value.includes(formItemClass))
                    errors.value.push(formItemClass)
                  return callback(
                    new Error(`${key} is required`),
                  )
                }
                else if (errors.value.includes(formItemClass)) { errors.value.splice(errors.value.indexOf(formItemClass), 1) }
                callback()
              },
            },
          ]
        }
        else {
          rules[key] = [
            {
              required: !!required,
              validator: (o, _, callback) => {
                const value = _model[key]
                if (!value) {
                  if (!errors.value.includes(formItemClass))
                    errors.value.push(formItemClass)
                  return callback(
                    new Error(`${key} is required`),
                  )
                }
                else if (errors.value.includes(formItemClass)) { errors.value.splice(errors.value.indexOf(formItemClass), 1) }
                callback()
              },
            },
          ]
        }
      }
      const typeComponent: TypeComponent = {
        Text: (type = 'text') => h(ElInput, {
          'modelValue': _model[key],
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
          'modelValue': _model[key],
          'class': className,
          style,
          disabled,
          'onUpdate:modelValue': modelValue,
        }),
        Number: () => h(ElInputNumber, {
          'modelValue': _model[key] || 0,
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
          'modelValue': _model[key],
          'class': className,
          style,
          placeholder,
          'onUpdate:modelValue': modelValue,
        }, {
          default: () => options.map((item: any) => h(ElOption, { value: item?.value, label: item?.label, disabled: item?.disabled || false })),
        }),
        Boolean: () => h(ElSwitch, {
          'modelValue': _model[key] || (_model[key] = false),
          'class': className,
          style,
          disabled,
          'onUpdate:modelValue': modelValue,
        }),
        Radio: (type = 'radio') => h(ElRadioGroup, {
          'modelValue': _model[key],
          'class': className,
          style,
          'onUpdate:modelValue': modelValue,
        }, {
          default: () => options.map((item: any) => h(type === 'radio'
            ? ElRadio
            : ElRadioButton, { label: item?.value, disabled: item.disabled, border }, { default: () => item?.label })),
        }),
        Checkbox: (type = 'checkbox') => h(ElCheckboxGroup, {
          'modelValue': _model[key] || [],
          'class': className,
          style,
          disabled,
          'onUpdate:modelValue': modelValue,
        }, {
          default: () => options.map((item: any) => h(type === 'checkbox'
            ? ElCheckbox
            : ElCheckboxButton, { label: item?.value, disabled: item?.disabled, border }, { default: () => item?.label })),
        }),
        CheckboxButton: () => typeComponent.Checkbox('checkboxButton'),
        RadioButton: () => typeComponent.Radio('radioButton'),
        Cascader: () => h(ElCascader, {
          'modelValue': _model[key] || [],
          'class': className,
          options,
          debounce,
          style,
          disabled,
          'props': {
            multiple,
          },
          placeholder,
          'filterable': true,
          'onUpdate:modelValue': modelValue,
          'collapse-tags-tooltip': true,
        }),
        Upload: () => h(ElUpload, {
          'fileList': _model[key] || [],
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
        }) as any,
      }
      const component = typeComponent[type as keyof TypeComponent]?.()
      if (!component) return null
      return h(ElFormItem, {
        label,
        prop: pKey ? `${pKey}[${index}]${key}` : key,
        class: formItemClass,
        position,
        size,
      }, {
        default: () => [h('div', {
          class: ' w-full text-1 lh-4 text-gray-600:50 mb-1',
        }, description), component],
      })

      function uploadChange(data: any) {
        _model[key] = _model[key] || []
        _model[key].push(data)
      }
      function removeFile(data: any) {
        _model[key].splice(data, 1)
      }
      function modelValue(val: any) {
        _model[key] = val
      }
      function judgeShow() {
        const el = document.querySelector(`.${formItemClass}`)! as HTMLElement
        if (!el)
          return
        if (!show)
          return el.style.display = 'block'
        for (const key in show) {
          const value = _model[key]
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
  },
}) as DefineComponent<{ schema: Schema }, {}, { getFormData: () => Record<string, any>; submit: () => Promise<boolean | Record<string, any>> }>
