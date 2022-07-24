import type { VNode } from 'vue'
export interface TypeComponent {
  string: () => VNode
  datepicker: () => VNode
  number: () => VNode
  select: () => VNode
  switch: () => VNode
  radio: () => VNode
  checkbox: () => VNode
}
