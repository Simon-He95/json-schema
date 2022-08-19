import type { VNode } from 'vue'
export interface TypeComponent {
  Text: (type?: string) => VNode
  Email: () => VNode
  RichText: () => VNode
  Password: () => VNode
  Date: () => VNode
  Number: () => VNode
  Enumeration: () => VNode
  Boolean: () => VNode
  Radio: (type?: string) => VNode
  Checkbox: (type?: string) => VNode
  CheckboxButton: () => VNode
  RadioButton: () => VNode
  Cascader: () => VNode
  Upload: () => VNode[]
}

export interface Schema {
  size?: 'small' | 'large' | 'default'
  name?: string
  description?: string
  attribs: Record<string, any>
}
