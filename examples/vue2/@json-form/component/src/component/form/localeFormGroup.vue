<template>
  <div class="s-locale-form-group">
    <Tabs v-model="activeLocale" size="small" type="card">
      <TabPane
        v-for="(label, localeField) in locales"
        :key="localeField"
        :name="localeField"
        :label="label"
      ></TabPane>
    </Tabs>
    <div class="s-locale-form-item" :key="`${item.type}-${field}`" v-for="(item, field) in fields">
      <silent-editor
        v-if="item.type === FIELD_TYPE_RICHTEXT"
        v-model="form[createKey(activeLocale, field)]"
        :height="item.height || '62px'"
        :toolbar="item.toolbar"
        :placeholder="item.placeholder"
      />
      <Input
        v-else
        v-model="form[createKey(activeLocale, field)]"
        :placeholder="item.placeholder"
        :type="item.type"
      />
    </div>
  </div>
</template>

<script>
import { FIELD_DIVIDER, FIELD_TYPE_RICHTEXT } from '@/utils/constant';
import { getJSONString } from '../../utils/utils';
import SilentEditor from '../editor'

/**
 * 多语言表单组
 *  - 暂只支持Input相关组件
 *
 * @param {LocaleItem[]} locales 多语言列表参数
 * @param {Field} fields 表单项列表参数
 * @param {Boolean} emptyAutoCompelete 最终值未填时自动补齐为空字符串
 * @type LocaleItem
 *  {
 *    field: String, // 语言code
 *    label: String  // 显示标题
 *  }
 * @type Field
 *  {
 *    [field]: FieldItem
 *  }
 * @type FieldItem
 *  {
 *    type: String,             // 表单项类型
 *    width: String,            // 表单项宽
 *    placeholder: String,      // 表单项占位提示语
 *    restriction: Restriction, // 选择项列表
 *  }
 * @type Restriction
 *  {
 *    [value]: [label]
 *  }
 */
export default {
  name: 'SilentLocaleFormGroup',
  components: {
    SilentEditor,
  },
  props: {
    locales: {
      type: Object,
      default: () => {
        return {};
      },
    },
    fields: {
      type: Object,
      default: () => {
        return {};
      },
    },
    emptyAutoCompelete: Boolean,
    value: {
      type: Object,
    },
  },

  watch: {
    value: {
      deep: true,
      handler(val, prevVal) {
        if (getJSONString(val) !== getJSONString(prevVal)) {
          this.formatValues(val);
        }
      },
    },

    form: {
      deep: true,
      handler(val) {
        this.clearTimer();
        this.startTimer(() => {
          const values = this.getValues(val);
          this.$emit('input', values);
        });
      },
    },

    locales: {
      deep: true,
      handler (val = {}) {
        const locales = Object.keys(val)
        this.activeLocale = locales[0]
      }
    },
  },

  data() {
    this.timer = null;
    this.FIELD_TYPE_RICHTEXT = FIELD_TYPE_RICHTEXT

    return {
      form: {},
      activeLocale: '',
    };
  },

  computed: {
    fieldsKey () {
      let keys = ''
      Object.values(this.fields).forEach(item => {
        keys += item.type
      })
      return keys
    },
  },

  beforeDestroy() {
    this.clearTimeout();
  },

  methods: {
    createKey(locale, field) {
      return `${locale}${FIELD_DIVIDER}${field}`;
    },

    formatValues(values) {
      if (!values) {
        this.form = {}
        return;
      }

      const result = {};

      Object.entries(values).forEach(([field, valItem]) => {
        const localeValue = valItem || {};
        Object.entries(localeValue).forEach(([localeField, val]) => {
          result[this.createKey(localeField, field)] = val;
        });
      });

      this.form = result;
    },

    getValues(values) {
      const data = {};
      
      Object.entries(values).forEach(([key, value]) => {
        const [localeField, field] = key.split(FIELD_DIVIDER);

        if (!data[field]) data[field] = {};

        data[field][localeField] = value;
      });

      // 自动补齐空字符串
      if (this.emptyAutoCompelete) {
        Object.keys(data).forEach(field => {
          Object.keys(this.locales).forEach(localeField => {
            if (!data[field][localeField]) data[field][localeField] = ''
          })
        })
      }
      return data;
    },

    startTimer(cb, timeout = 500) {
      this.timer = setTimeout(cb, timeout);
    },

    clearTimer() {
      this.timer && clearTimeout(this.timer);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/style/index.scss';
.s-locale-form {
  &-item {
    margin-bottom: 16px;
  }

  &-group {
    ::v-deep {
      .ivu-tabs-nav-container {
        height: 29px;
      }

      .ivu-tabs-tab {
        font-size: $font-size-text;
        height: 28px;
      }

      .ivu-tabs-tab-active {
        height: 29px;
      }
    }
  }
}
</style>
