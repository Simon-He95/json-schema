import type { VNode } from 'vue'
export interface TypeComponent {
  string: (type?: string) => VNode
  datepicker: () => VNode
  number: () => VNode
  select: () => VNode
  switch: () => VNode
  radio: (type?: string) => VNode
  checkbox: (type?: string) => VNode
  checkboxButton: () => VNode
  password: () => VNode
  textarea: () => VNode
  radioButton: () => VNode
  cascader: () => VNode
}

export interface Schema {
  size?: 'small' | 'large' | 'default'
  order?: string[]
  title?: string
  description?: string
  form: Record<string, any>
}
