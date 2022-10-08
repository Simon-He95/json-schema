import { TAB_BASIC, TAB_ADVANCE } from '../../utils/options';
import { isEmpty, isEmptyArray } from '../../utils/type';
import { getJSONString, safeCallRef } from '../../utils/utils';

export default {
  props: {
    active: String,
    defaultValue: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  watch: {
    defaultValue: {
      deep: true,
      handler(val, prevVal) {
        if (getJSONString(val) !== getJSONString(prevVal)) {
          this.echoForm(val);
        }
      },
    },
  },

  data() {
    this.TAB_BASIC = TAB_BASIC;
    this.TAB_ADVANCE = TAB_ADVANCE;

    return {
      // form: {},
    };
  },

  methods: {
    // 回显表单
    echoForm(values = {}) {
      this.form = values;
      console.log('==values', values)
    },

    // 调用表单实例validate方法验证表单
    validateForm(formRef) {
      return new Promise((resolve, reject) => {
        if (!formRef) resolve();

        formRef.validate((success) => {
          success ? resolve() : reject();
        });
      });
    },

    // 校验表单
    validateValues() {
      const formResult = this.validateForm(this.$refs.form);
      const advanceFormResult = this.validateForm(this.$refs.advanceForm);
      return Promise.all([formResult, advanceFormResult]).then(() => {
        return {
          ...this.formatValues(this.form),
        };
      });
    },

    // 去空属性
    formatValues(values = {}) {
      const result = {};

      Object.entries(values).forEach(([key, val]) => {
        if (!(isEmpty(val) || isEmptyArray(val))) result[key] = val;
      });

      return result;
    },

    // 重置表单
    resetForm() {
      safeCallRef(this.$refs.form, 'resetFields');
      safeCallRef(this.$refs.advanceForm, 'resetFields');
    },
  },
};
