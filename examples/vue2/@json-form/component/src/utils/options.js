import { FIELD_TYPE_TEXT, FIELD_TYPE_SELECT } from './constant';

export const formColumns = [
  {
    title: '标签名',
    key: 'label',
    clickable: true,
    clickTips: '点击打开编辑弹窗',
  },
  {
    title: '类型',
    key: 'component',
    slot: 'component',
  },
  {
    title: '键名',
    key: 'key',
  },
  {
    title: ' ',
    key: 'actions',
  },
];

// 基础组件相关参数
export const BASIC_COMP_INPUT = 'Input';
export const BASIC_COMP_RICHTEXT = 'RichText';
export const BASIC_COMP_EMAIL = 'Email';
export const BASIC_COMP_PHONE = 'Phone';
export const BASIC_COMP_PASSWORD = 'Password';
export const BASIC_COMP_NUMBER = 'Number';
export const BASIC_COMP_DATE = 'Date';
export const BASIC_COMP_SELECT = 'Select';
export const BASIC_COMP_CASCADER = 'Cascader';
export const BASIC_COMP_COUNTRYSELECT = 'CountrySelect';
export const BASIC_COMP_SWITCH = 'Switch';
export const BASIC_COMP_ENUM = 'Enum';
export const BASIC_COMP_IMAGESELECT = 'ImageSelect';
export const BASIC_COMP_FILEUPLOAD = 'FileUpload';
export const BASIC_COMP_IMAGEUPLOAD = 'ImageUpload';
export const BASIC_COMP_JSON = 'Json';
export const BASIC_COMP_GROUP = 'Group';

export const basicFormItems = {
  [BASIC_COMP_INPUT]: {
    name: '普通文本',
    icon: 'inputCard',
    desc: '用于文本输入',
  },
  [BASIC_COMP_RICHTEXT]: {
    name: '富文本',
    icon: 'richTextCard',
    desc: '用于输入有格式的文本',
    disabled: true,
  },
  [BASIC_COMP_EMAIL]: {
    name: '邮箱',
    icon: 'emailCard',
    desc: '用于输入邮箱',
    disabled: true,
  },
  [BASIC_COMP_PHONE]: {
    name: '手机号',
    icon: 'inputCard',
    desc: '用于输入手机号',
    disabled: true,
  },
  [BASIC_COMP_PASSWORD]: {
    name: '密码',
    icon: 'passwordCard',
    desc: '用于输入密码',
    disabled: true,
  },
  [BASIC_COMP_NUMBER]: {
    name: '数字',
    icon: 'numberCard',
    desc: '用于输入数字',
  },
  [BASIC_COMP_DATE]: {
    name: '日期',
    icon: 'dateCard',
    desc: '用于选择日期或时间',
  },
  [BASIC_COMP_SELECT]: {
    name: '下拉选择',
    icon: 'listCard',
    desc: '用于下拉选择',
  },
  [BASIC_COMP_CASCADER]: {
    name: '级联选择',
    icon: 'listCard',
    desc: '用于级联选择',
    disabled: true,
  },
  [BASIC_COMP_COUNTRYSELECT]: {
    name: '国家选择',
    icon: 'listCard',
    desc: '用于选择国家',
    disabled: true,
  },
  [BASIC_COMP_SWITCH]: {
    name: '开关',
    icon: 'switchCard',
    desc: '用于选择是与否',
  },
  [BASIC_COMP_ENUM]: {
    name: '枚举选择',
    icon: 'listCard',
    desc: '用于选择枚举值',
  },
  [BASIC_COMP_IMAGESELECT]: {
    name: '图片选择',
    icon: 'listCard',
    desc: '用于选择图片',
    disabled: true,
  },
  [BASIC_COMP_FILEUPLOAD]: {
    name: '文件上传',
    icon: 'mediaCard',
    desc: '用于上传文件',
    disabled: true,
  },
  [BASIC_COMP_IMAGEUPLOAD]: {
    name: '图片上传',
    icon: 'mediaCard',
    desc: '用于上传图片',
    disabled: true,
  },
  [BASIC_COMP_JSON]: {
    name: 'JSON',
    icon: 'jsonCard',
    desc: '用于输入json格式数据',
    disabled: true,
  },
  [BASIC_COMP_GROUP]: {
    name: '组',
    icon: 'componentCard',
    desc: '用于配置一组相互关联的内容',
  },
};

export const CUSTOM_COMP_LOCALEGROUP = 'LocaleGroup';
export const CUSTOM_COMP_GOODSGROUP = 'GoodsGroup';
export const CUSTOM_COMP_PIDBATCHSELECT = 'PidBatchSelect';
export const CUSTOM_COMP_SERVERSELECT = 'ServerSelect';

export const customFormItems = {
  [CUSTOM_COMP_LOCALEGROUP]: {
    name: '多语言组',
    icon: 'linkCard',
    desc: '用于配置多语言相关内容',
    disabled: true,
  },
  [CUSTOM_COMP_GOODSGROUP]: {
    name: '物品选择组',
    icon: 'linkCard',
    desc: '用于配置物品选择相关内容',
    disabled: true,
  },
  [CUSTOM_COMP_PIDBATCHSELECT]: {
    name: '角色ID批量添加',
    icon: 'dynamicCard',
    desc: '用于批量添加角色ID，可查询添加或手动添加',
  },
  [CUSTOM_COMP_SERVERSELECT]: {
    name: '服务器选择',
    icon: 'dynamicCard',
    desc: '用于选择服务器',
  },
};

// 配置tab相关参数
export const TAB_BASIC = 'basic';
export const TAB_ADVANCE = 'advance';
export const configTabs = {
  [TAB_BASIC]: '基本配置',
  [TAB_ADVANCE]: '高级配置',
};

// 显隐关联相关参数
export const HIDE_RULE_EQUAL = 'equal';
export const HIDE_RULE_NOTNULL = 'notnull';
export const HIDE_RULE_REGEXP = 'regexp';

export const hideFields = {
  key: {
    placeholder: '选择关联字段',
    width: '200px',
    type: FIELD_TYPE_SELECT,
    restriction: {},
    filterable: true,
  },
  rule: {
    placeholder: '选择关联规则',
    width: '200px',
    type: FIELD_TYPE_SELECT,
    restriction: {
      [HIDE_RULE_EQUAL]: '表单项值等于',
      [HIDE_RULE_NOTNULL]: '表单项值不为空',
      [HIDE_RULE_REGEXP]: '表单项值匹配正则表达式',
    },
  },
  value: {
    placeholder: '规则值',
    width: '260px',
    type: FIELD_TYPE_TEXT,
  },
};

// 正则匹配相关参数
export const regExpFields = {
  rule: {
    placeholder: '正则表达式',
    width: '280px',
    type: FIELD_TYPE_TEXT,
  },
  message: {
    placeholder: '错误提示',
    width: '320px',
    type: FIELD_TYPE_TEXT,
  },
};

// input组件相关参数
export const INPUT_TYPE_TEXT = 'Text';
export const INPUT_TYPE_TEXTAREA = 'Textarea';
export const inputTypes = {
  [INPUT_TYPE_TEXT]: {
    title: '短文本',
    desc: '适用于短文本输入，如：标题、姓名等',
  },
  [INPUT_TYPE_TEXTAREA]: {
    title: '长文本',
    desc: '适用于大段长文本输入，如：描述、段落等',
  },
};

// richtext组件相关参数
export const RICHTEXT_TOOL_BOLD = 'bold';
export const RICHTEXT_TOOL_FONTCOLOR = 'fontColor';
export const RICHTEXT_TOOL_ITALIC = 'italic';
export const RICHTEXT_TOOL_STRIKE = 'strike';
export const RICHTEXT_TOOL_UNDERLINE = 'underline';
export const RICHTEXT_TOOL_LINK = 'link';

export const richtextTypes = {
  [RICHTEXT_TOOL_BOLD]: '加粗',
  [RICHTEXT_TOOL_FONTCOLOR]: '字体颜色',
  [RICHTEXT_TOOL_ITALIC]: '斜体',
  [RICHTEXT_TOOL_STRIKE]: '删除线',
  [RICHTEXT_TOOL_UNDERLINE]: '下划线',
  [RICHTEXT_TOOL_LINK]: '链接',
};

// number组件相关参数
export const NUM_TYPE_INT = 'int';
// export const NUM_TYPE_DECIMAL = 'decimal'
export const NUM_TYPE_FLOAT = 'float';

export const numberTypes = {
  [NUM_TYPE_INT]: '整数',
  // [NUM_TYPE_DECIMAL]: 'decimal',
  [NUM_TYPE_FLOAT]: '小数',
};

// date相关参数
export const DATE_TYPE_DATE = 'date';
export const DATE_TYPE_DATETIME = 'datetime';
export const DATE_TYPE_YEAR = 'year';
export const DATE_TYPE_MONTH = 'month';

export const dateTypes = {
  [DATE_TYPE_YEAR]: '年份（例: 2022）',
  [DATE_TYPE_MONTH]: '月份（例: 2022-01）',
  [DATE_TYPE_DATE]: '日期（例: 2022-01-01）',
  [DATE_TYPE_DATETIME]: '日期时间（例: 2022-01-01 12:00:00）',
};

export const TIME_TYPE_TIME = 'time';

export const timeTypes = {
  [TIME_TYPE_TIME]: '时间（例: 00:00:00）',
};

export const RANGE_TYPE_DATERANGE = 'daterange';
export const RANGE_TYPE_DATETIMERANGE = 'datetimerange';
export const RANGE_TYPE_TIMERANGE = 'timerange';

export const rangeTypes = {
  [RANGE_TYPE_DATERANGE]: '日期（例: 2022-01-01 ~ 2022-01-02）',
  [RANGE_TYPE_TIMERANGE]: '时间（例: 00:00:00 ~ 12:00:00）',
  [RANGE_TYPE_DATETIMERANGE]:
    '日期时间（例: 2022-01-01 12:00:00 ~ 2022-01-02 12:00:00）',
};

export const DATE_FMT_TIMESTAMP = 'timestamp';
export const DATE_FMT_UNIXTIMESTAMP = 'unixtimestamp';
export const dateFormattors = {
  [DATE_FMT_TIMESTAMP]: '时间戳（毫秒级）',
  [DATE_FMT_UNIXTIMESTAMP]: '时间戳（秒级）',
};

// 判断传入的类型是否为时间
export function isTimeType(type) {
  return [TIME_TYPE_TIME, RANGE_TYPE_TIMERANGE].indexOf(type) > -1;
}

// select相关参数
export const SELECT_TYPE_SINGLE = 'false';
export const SELECT_TYPE_MULTIPLE = 'true';
export const selectTypes = {
  [SELECT_TYPE_SINGLE]: '单选',
  [SELECT_TYPE_MULTIPLE]: '多选',
};
export const optionsFields = {
  label: {
    placeholder: '选择项名称',
    width: '260px',
    type: FIELD_TYPE_TEXT,
  },
  value: {
    placeholder: '选择项值',
    width: '260px',
    type: FIELD_TYPE_TEXT,
  },
};

// enum相关参数
export const ENUM_TYPE_SINGLE = 'radio';
export const ENUM_TYPE_MULTIPLE = 'checkbox';
export const enumTypes = {
  [ENUM_TYPE_SINGLE]: '单选',
  [ENUM_TYPE_MULTIPLE]: '多选',
};

// cascader相关参数
export const CASCADER_TYPE_SINGLE = 'false';
export const CASCADER_TYPE_MULTIPLE = 'true';
export const cascaderTypes = {
  [CASCADER_TYPE_SINGLE]: '单选',
  [CASCADER_TYPE_MULTIPLE]: '多选',
};

export const recordsColumns = [
  {
    title: 'ID',
    key: 'id',
    clickable: true,
    clickTips: '点击打开编辑弹窗',
  },
  // {
  //   title: '表单ID',
  //   key: 'form_id',
  // },
  {
    title: '发送数据',
    key: 'template_map',
    clickable: true,
    clickTips: '查看发送数据',
  },
  {
    title: '响应',
    key: 'notice_res',
    clickable: true,
    // slot: 'notice_res',
  },
  // {
  //   title: '更新时间',
  //   key: 'updated_at',
  //   slot: 'updated_at',
  // },
  {
    title: '创建时间',
    key: 'created_at',
    slot: 'created_at',
  },
];
