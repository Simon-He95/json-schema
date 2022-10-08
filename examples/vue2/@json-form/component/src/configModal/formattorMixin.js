import {
  isTimeType,
  BASIC_COMP_DATE,
  BASIC_COMP_INPUT,
  BASIC_COMP_RICHTEXT,
  BASIC_COMP_PHONE,
  BASIC_COMP_SELECT,
  BASIC_COMP_CASCADER,
  BASIC_COMP_ENUM,
  BASIC_COMP_SWITCH,
  SELECT_TYPE_MULTIPLE,
  INPUT_TYPE_TEXTAREA,
} from '../utils/options';
import { getJSON, capitalizeFstLetter } from '../utils/utils';
import { isUef } from '../utils/type';

export default {
  methods: {
    // 格式化处理参数 - for JsonForm
    formatComponent(record) {
      const {
        regExp,
        component,
        defaultValue,
        max,
        min,
        type,
        formattor,
        trueValue,
        falseValue,
        ...restRecord
      } = record;
      const formItem = {
        ...restRecord,
        type,
      };
      console.log('====formatComponent', record);
      switch (component) {
        // 处理Date组件
        case BASIC_COMP_DATE:
          formItem.type = 'Date';
          formItem.date = this.formatDate(type, formattor);
          break;

        // 处理Input组件
        case BASIC_COMP_INPUT:
        case BASIC_COMP_RICHTEXT:
          formItem.default = defaultValue;
          formItem.len = this.formatLimit(max, min);
          formItem.rules = this.formatRegExp(regExp);
          break;

        // 处理Phone组件
        case BASIC_COMP_PHONE:
          formItem.customRender = this.formatPhoneRender(record);
          break;

        case BASIC_COMP_SELECT:
          formItem.type = 'Enumeration';
          formItem.customRender = this.formatEnumRender(record);
          break;

        case BASIC_COMP_CASCADER:
          formItem.options = getJSON(record.options, {});
          console.log('===record.options', record.options);
          formItem.type = component;
          break;

        case BASIC_COMP_ENUM:
          formItem.type = capitalizeFstLetter(record.type);
          formItem.border = true;
          break;

        case BASIC_COMP_SWITCH:
          formItem.type = 'Boolean';
          formItem.switchFalse = falseValue;
          formItem.switchTrue = trueValue;
          break;

        default:
          formItem.type = formItem.type || component;
          formItem.default = defaultValue;
      }

      return formItem;
    },

    // 格式化日期参数
    formatDate(type, formattor) {
      if (isUef(type) && isUef(formattor)) return;
      return {
        type,
        formattor,
      };
    },

    // 格式化最大值
    formatLimit(max, min) {
      if (isUef(max) && isUef(min)) return;

      return {
        max,
        min,
      };
    },

    // 格式化正则
    formatRegExp(regExp) {
      if (isUef(regExp)) return;

      return regExp.map((item) => ({
        regExp: item.rule,
        errMsg: item.message,
      }));
    },

    // 将最小值格式化为正则条件
    formatMinRule(min) {
      if (isUef(min)) return;
      return {
        errMsg: '请输入',
        regExp: `.{${min},}`,
      };
    },
  },
};
