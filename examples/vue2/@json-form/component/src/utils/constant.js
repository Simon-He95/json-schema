// 指令表单步骤
export const COMMAND_STEP_TYPE_SELECT = 0;
export const COMMAND_STEP_CONFIG = 1;

// 表单项类型
export const FIELD_TYPE_NUMBER = 'number';
export const FIELD_TYPE_TAB = 'tab';
export const FIELD_TYPE_TEXT = 'text';
export const FIELD_TYPE_SELECT = 'select';
export const FIELD_TYPE_TEXTAREA = 'textarea';
export const FIELD_TYPE_RICHTEXT = 'richtext';
export const FIELD_TYPE_TIME = 'time';
export const FIELD_TYPE_DATETIME = 'datetime';
export const FIELD_TYPE_DIVIDER = 'divider';
export const FIELD_TYPE_CHECKBOX = 'checkbox';

// 表单类型列表
export const FIELD_TYPES_DATE = [FIELD_TYPE_DATETIME];
export const FIELD_TYPES_INPUT = [
  FIELD_TYPE_TEXT,
  FIELD_TYPE_TEXTAREA,
  'number',
  'email',
  'tel',
  'password',
];

export const LABEL_DIVIDER = ' / ';
