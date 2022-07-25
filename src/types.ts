import type { VNode } from 'vue'
export interface TypeComponent {
  string: (type?: string) => VNode
  datepicker: () => VNode
  number: () => VNode
  select: () => VNode
  switch: () => VNode
  radio: () => VNode
  checkbox: () => VNode
  password: () => VNode
}
