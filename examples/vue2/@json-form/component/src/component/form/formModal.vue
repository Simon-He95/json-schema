<template>
  <silent-model class="template-modal" :modal="visible" @close="onClose">
    <div slot="title" class="title">{{ title }}</div>

    <template v-for="item in fields">
      <!-- 一行多个表单项 -->
      <template v-if="isArray(item)">
        <form-item>
          <template v-for="innerItem in item">
            <!-- 分隔符 -->
            <div class="divider" v-if="innerItem.type === 'divider'">
              {{ innerItem.placeholder }}
            </div>

            <form-item
              v-else
              :key="innerItem.field"
              :field="innerItem.field"
              :message="formError[innerItem.field]"
              @clear="onClearMessage"
            >
              <!-- 选择 -->
              <Select
                v-if="innerItem.type === 'select'"
                v-model="form[innerItem.field]"
                :placeholder="innerItem.placeholder"
              >
                <Option
                  v-for="option in innerItem.restriction"
                  :value="option.value"
                  :key="option.value"
                  >{{ option.label }}</Option
                >
              </Select>

              <!-- 日期选择 -->
              <DatePicker
                v-else-if="dateTypes.includes(innerItem.type)"
                v-model="form[innerItem.field]"
                format="yyyy-MM-dd HH:mm:ss"
                :placeholder="innerItem.placeholder"
                :type="innerItem.type"
              />

              <!-- 输入框 -->
              <Input
                v-else
                v-model="form[innerItem.field]"
                :placeholder="innerItem.placeholder"
                :type="innerItem.type"
              />
            </form-item>
          </template>
        </form-item>
      </template>

      <!-- tab分类的表单项 -->
      <template v-else-if="item.tabs && item.tabs.length">
        <form-item
          :field="item.field"
          :message="formError[item.field]"
          placement="right-start"
          @clear="onClearMessage"
        >
          <Tabs>
            <TabPane
              v-for="tab in item.tabs"
              :key="tab.field"
              :label="tab.label"
            >
              <form-item
                v-for="tabChild in tab.children"
                :key="tabChild.field"
                :field="tabChild.field"
              >
                <!-- 选择 -->
                <Select
                  v-if="tabChild.type === 'select'"
                  v-model="form[tabChild.field]"
                  :placeholder="tabChild.placeholder"
                >
                  <Option
                    v-for="option in tabChild.restriction"
                    :value="option.value"
                    :key="option.value"
                    >{{ option.label }}</Option
                  >
                </Select>

                <!-- 日期选择 -->
                <DatePicker
                  v-else-if="dateTypes.includes(tabChild.type)"
                  v-model="form[tabChild.field]"
                  format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="tabChild.placeholder"
                  :type="tabChild.type"
                />

                <!-- 输入框 -->
                <Input
                  v-else
                  v-model="form[tabChild.field]"
                  :placeholder="tabChild.placeholder"
                  :type="tabChild.type"
                />
              </form-item>
            </TabPane>
          </Tabs>
        </form-item>
      </template>

      <!-- 一行单个表单项 -->
      <template v-else>
        <form-item
          :key="item.field"
          :field="item.field"
          :message="formError[item.field]"
          @clear="onClearMessage"
        >
          <!-- 选择 -->
          <Select
            v-if="item.type === 'select'"
            v-model="form[item.field]"
            :placeholder="item.placeholder"
          >
            <Option
              v-for="option in item.restriction"
              :value="option.value"
              :key="option.value"
              >{{ option.label }}</Option
            >
          </Select>

          <!-- 日期选择 -->
          <DatePicker
            v-else-if="dateTypes.includes(item.type)"
            v-model="form[item.field]"
            format="yyyy-MM-dd HH:mm:ss"
            :placeholder="item.placeholder"
            :type="item.type"
          />

          <!-- 输入框 -->
          <Input
            v-else
            v-model="form[item.field]"
            :placeholder="item.placeholder"
            :type="item.type"
          />
        </form-item>
      </template>
    </template>

    <silent-model-button
      slot="button"
      :isFull="submit.isReady"
      :submit="submit"
      @click="onSubmit"
    ></silent-model-button>
  </silent-model>
</template>

<script>
import {
  FIELD_FORMAT_UNIX_TSTP,
  FIELD_FORMAT_ARRAY,
  FIELD_FORMAT_ARRAY_NUMBER,
  FIELD_FORMAT_NUMBER,
  FIELD_FORMAT_TAB,
  FIELD_TYPE_TAB,
  FIELD_TYPES_DATE,
  FIELD_TYPES_INPUT,
} from '@/utils/constant';
import { isArray, isObject, isEmpty, isString, isUef } from '@/utils/type';
import FormItem from './formItem.vue';

export default {
  name: 'FormModal',

  components: {
    FormItem,
  },

  props: {
    visible: Boolean,
    type: String,
    title: String,
    formConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    submit: {
      type: Object,
      default: () => {
        return {};
      },
    },
    dataSource: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    this.dateTypes = FIELD_TYPES_DATE;
    this.inputTypes = FIELD_TYPES_INPUT;
    this.fieldDivider = '/';

    const { fields, formator } = this.formatFormConfig(this.formConfig);

    this.fields = fields;
    this.formatorMap = formator;

    return {
      form: {},
      formError: {},
    };
  },

  watch: {
    dataSource: {
      deep: true,
      handler(val) {
        if (isObject(val)) {
          this.$nextTick(() => {
            const formattedFields = this.initFields(val);
            this.form = formattedFields;
          });
        }
      },
    },

    visible(val) {
      if (val) {
        if (isObject(this.dataSource)) {
          this.$nextTick(() => {
            const formattedFields = this.initFields(this.dataSource);
            this.form = formattedFields;
          });
        }
      }
    },
  },

  methods: {
    isArray,
    isObject,

    onClose() {
      this.resetFields();
      this.$emit('close');
    },

    onCancel() {},

    onRun() {},

    resetFields() {
      this.form = {};
      this.formError = {};
    },

    validateFields() {
      const formValues = this.form;
      let isLegal = true;

      this.fields.forEach((field) => {
        let fieldLegal = true;
        // TODO: 表单项为数组
        if (isArray(field)) {
        }

        // 表单项为tab分类表单
        if (field.tabs) {
          field.tabs.forEach((tabItem) => {
            const { children } = tabItem;

            children.forEach((child) => {
              fieldLegal = this.validateField(
                child,
                formValues,
                tabItem.label,
                field.field
              );
              if (!fieldLegal) isLegal = false;
            });
          });
        }

        // 普通表单项
        fieldLegal = this.validateField(field, formValues);

        if (!fieldLegal) isLegal = false;
      });

      return new Promise((resolve, reject) => {
        if (isLegal) {
          const finalValue = this.formatFields(this.form);

          resolve(finalValue);
        } else {
          reject(this.formError);
        }
      });
    },

    // 校验单项
    validateField(fieldObj = {}, values, prefix = '', errorField) {
      const { rules, field, placeholder } = fieldObj;
      const mergedField = errorField || field;

      if (rules) {
        return rules.some((rule) => {
          if (rule.required) {
            let value = values[field] || '';
            if (isString(value[field])) {
              value = value.trim();
            }

            if (isEmpty(value)) {
              let finalMessage = `${prefix}${
                rule.message || `${placeholder}必填`
              }`;

              // errorField存在时表示错误信息需累加
              if (errorField) {
                const prevErrorMsg = this.formError[errorField];
                finalMessage =
                  (prevErrorMsg ? `${prevErrorMsg}<br />` : '') + finalMessage;
              }
              this.$set(this.formError, mergedField, finalMessage);
              return false;
            }
          }

          return true;
        });
      }

      // TODO: 支持自定义校验器validator

      return true;
    },

    collectFormator(formator = new Map(), target = {}, parentType) {
      const { field, format, type } = target;

      if (isUef(field)) return;

      // 存在父元素时默认
      switch (parentType) {
        case FIELD_TYPE_TAB:
          return formator.set(field, [FIELD_FORMAT_TAB]);
      }

      // 拼接自定义格式化工具
      if (format) {
        let mergedFormat;

        // 合并格式化工具
        if (formator.has(field)) {
          mergedFormat = formator.get(field);
        } else {
          mergedFormat = [];
        }

        mergedFormat.push(format);
        formator.set(field, mergedFormat);
        return;
      }

      // 未定义format的情况下填充默认format
      switch (type) {
        case 'number':
          return formator.set(field, [FIELD_FORMAT_NUMBER]);

        case 'datetime':
          return formator.set(field, [FIELD_FORMAT_UNIX_TSTP]);
      }
    },

    formatFormConfig(config = []) {
      const formator = new Map();
      const fields = config.map((configItem, index) => {
        if (isArray(configItem)) {
          // 收集字段格式化定义放入map中
          configItem.forEach((item) => {
            this.collectFormator(formator, item);
          });
          return [...configItem];
        }

        const itemData = { ...configItem };
        const { tabs, field, format } = configItem;

        // 处理tabs为对象的情况
        if (tabs) {
          itemData.field = `_tab${index}`;

          if (isObject(tabs)) {
            itemData.tabs = tabs.field.map((field, tabIndex) => {
              // 格式化子元素
              const formatChild = tabs.children.map((child) => {
                this.collectFormator(formator, child, itemData.type);
                return {
                  ...child,
                  field: `${field}${this.fieldDivider}${child.field}`,
                };
              });
              return {
                label: tabs.label[tabIndex],
                field,
                children: formatChild,
              };
            });
          }
        }

        this.collectFormator(formator, configItem);
        return itemData;
      });

      return {
        fields,
        formator,
      };
    },

    onSubmit() {
      this.validateFields()
        .then((values) => {
          const mergedValues = Object.assign(this.dataSource, values);
          this.$emit('submit', mergedValues);
        })
        .catch((err) => {
          console.log('error', err);
        });
    },

    // 初始格式化数据，回显
    initFields(values) {
      const finalValues = {};
      const formatMap = this.formatorMap;
      console.log('success', values, formatMap);

      Object.entries(values).forEach(([key, val]) => {
        const curFormat = formatMap.get(key);

        if (!curFormat) {
          finalValues[key] = val;
          return;
        }

        // 处理tab类型
        if (curFormat.includes(FIELD_FORMAT_TAB)) {
          return Object.entries(JSON.parse(val)).forEach(
            ([innerKey, innerVal]) => {
              const mergedKey = `${innerKey}${this.fieldDivider}${key}`;
              finalValues[mergedKey] = this.initField(curFormat, innerVal);
            }
          );
        }

        finalValues[key] = this.initField(curFormat, val);
      });

      return finalValues;
    },

    // 根据传入的格式，格式化表单值
    initField(format, value) {
      if (isArray(format)) {
        const reverseFormat = format.reverse();
        return reverseFormat.reduce((result, innerFormat) => {
          return this.initField(innerFormat, result);
        }, value);
      }

      console.log('==format', format, value);
      try {
        switch (format) {
          case FIELD_FORMAT_UNIX_TSTP:
            return new Date(value * 1000);

          // case FIELD_FORMAT_JSON:
          //   finalValue = JSON.stringify(value)
          //   break

          case FIELD_FORMAT_ARRAY:
          case FIELD_FORMAT_ARRAY_NUMBER:
            return JSON.parse(value).join('\n');

          case FIELD_FORMAT_NUMBER:
            return parseFloat(value);

          default:
            return value;
        }
      } catch {
        return value;
      }
    },

    // 最终提交前格式化数据
    formatFields(values) {
      const finalValues = {};
      const formatMap = this.formatorMap;
      const needStrigify = [];
      console.log('formatFields', values, formatMap);
      Object.entries(values).forEach(([key, val]) => {
        // 收集tab构成的组合表单项值
        const splitKeys = key.split(this.fieldDivider);

        if (splitKeys.length > 1) {
          const field = splitKeys[1];
          const innerField = splitKeys[0];

          if (isUef(finalValues[field])) {
            finalValues[field] = {};
          }

          finalValues[field][innerField] = this.formatField(
            formatMap.get(innerField),
            val
          );
          if (!needStrigify.includes(field)) {
            needStrigify.push(field);
          }
          return;
        }

        finalValues[key] = this.formatField(formatMap.get(key), val);
      });

      needStrigify.forEach((field) => {
        finalValues[field] = JSON.stringify(finalValues[field]);
      });
      return finalValues;
    },

    // 根据传入的格式，格式化表单值
    formatField(format, value = '') {
      if (isArray(format)) {
        return format.reduce((result, innerFormat) => {
          return this.formatField(innerFormat, result);
        }, value);
      }

      console.log('==format', format, value);
      try {
        switch (format) {
          case FIELD_FORMAT_UNIX_TSTP:
            return Math.round(new Date(value).getTime() / 1000);

          // case FIELD_FORMAT_JSON:
          //   return JSON.stringify(JSON.parse(value))

          case FIELD_FORMAT_ARRAY:
            return JSON.stringify(value.split('\n'));

          case FIELD_FORMAT_NUMBER:
            return parseFloat(value);

          case FIELD_FORMAT_ARRAY_NUMBER:
            return JSON.stringify(
              value.split('\n').map((item) => parseFloat(item))
            );

          default:
            return value;
        }
      } catch {
        return value;
      }
    },

    // 处理tab格式化
    handleTabFormat() {},

    // 清理报错提示
    onClearMessage(field) {
      this.formError[field] = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.template-modal {
  ::v-deep {
    .swiper-container {
      overflow: visible !important;
    }
  }
}
.s-form-item {
  display: flex;
  align-items: center;

  .divider {
    margin: 0 16px;
  }

  ::v-deep {
    .ivu-date-picker {
      flex-grow: 1;
    }
    .ivu-select-single {
      .ivu-select-selection {
        height: 32px;
        .ivu-select-placeholder,
        .ivu-select-selected-value {
          height: 32px;
          line-height: 30px;
        }
      }
    }
    .ivu-tabs-nav .ivu-tabs-tab {
      font-size: 12px;
    }
  }
}
</style>
