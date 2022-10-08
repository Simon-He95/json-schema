<template>
  <div class="s-addable-form-group">
    <div class="s-addable-form-group-list">
      <template v-for="(item, field) in fields">
        <!-- 选择器 -->
        <Select
          v-if="item.type === selecType"
          v-model="form[field]"
          :placeholder="item.placeholder"
          :filterable="item.filterable"
          :multiple="item.multiple"
          :disabled="disabled"
          :style="{ width: item.width || 'auto' }"
        >
          <Option
            v-for="(label, value) in item.restriction"
            :value="value"
            :key="value"
            >{{ label }}</Option
          >
        </Select>

        <!-- 日期选择 -->
        <DatePicker
          v-else-if="dateTypes.includes(item.type)"
          v-model="form[field]"
          format="yyyy-MM-dd HH:mm:ss"
          :placeholder="item.placeholder"
          :type="item.type"
          :disabled="disabled"
          :style="{ width: item.width || 'auto' }"
        />

        <!-- 多选框 -->
        <template v-else-if="checkboxTypes.includes(item.type)">
          <!-- TODO: 支持checkbox组 -->
          <!-- <CheckboxGroup v-if="isArray(item.placeholder)"></CheckboxGroup> -->
          <Checkbox
            v-model="form[field]"
            :disabled="disabled"
            :style="{ width: item.width || 'auto' }"
            >{{ item.placeholder }}</Checkbox
          >
        </template>

        <!-- 输入框 -->
        <Input
          v-else
          v-model="form[field]"
          :placeholder="item.placeholder"
          :type="item.type"
          :disabled="disabled"
          :style="{ width: item.width || 'auto' }"
        />
      </template>
      <silent-button type="primary" :disabled="disabled" @click="onCreate"
        >新 增</silent-button
      >
    </div>
    <div class="s-addable-form-group-values">
      <Tag
        v-for="val in values"
        :key="val._key"
        :title="val._label"
        :closable="disabled ? false : true"
        @on-close="onDelete(val)"
        >{{ val._label }}</Tag
      >
    </div>
  </div>
</template>

<script>
/**
 * 可增加的表单组组件
 * TODO: defaultValue回显
 */
import {
  FIELD_TYPES_DATE,
  FIELD_TYPE_DATETIME,
  FIELD_TYPE_SELECT,
  FIELD_TYPES_INPUT,
  FIELD_TYPE_CHECKBOX,
  LABEL_DIVIDER,
} from '../../utils/constant';
import { formatDateLabel } from '../../utils/date';
import { isArray } from '../../utils/type';
import { getJSONString } from '../../utils/utils';

let recordIndex = 0;

export default {
  name: 'JFAddableFormGroup',
  props: {
    fields: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: Array,
    disabled: Boolean,
  },

  data() {
    this.dateTypes = FIELD_TYPES_DATE;
    this.selecType = FIELD_TYPE_SELECT;
    this.inputTypes = FIELD_TYPES_INPUT;
    this.checkboxTypes = FIELD_TYPE_CHECKBOX;

    return {
      form: {},
      values: [],
    };
  },

  watch: {
    value: {
      deep: true,
      handler(val, prevVal) {
        if (getJSONString(val) !== getJSONString(prevVal)) {
          this.values = (val || []).map((item) => {
            return this.formatValue(item);
          });
        }
      },
    },

    values: {
      deep: true,
      handler(val = []) {
        const formatedData = [];

        val.forEach((item) => {
          const temp = {
            ...item,
          };
          // 移除内部属性
          delete temp._key;
          delete temp._label;
          formatedData.push(temp);
        });

        this.$emit('input', formatedData);
      },
    },
  },

  methods: {
    formatValue(formValues = {}) {
      const record = {
        _key: recordIndex++,
        _label: '',
      };
      
      Object.entries(this.fields).forEach(([field, item], index) => {
        const value = formValues[field];
        let curLabel = '';
        record[field] = value;

        switch (item.type) {
          case FIELD_TYPE_SELECT:
            let valArr = value;
            if (!isArray(value)) {
              valArr = [value];
            }
            const labelValues = valArr.map(
              (optionVal) => item.restriction[optionVal] || optionVal
            );
            curLabel = labelValues.join(' + ');
            break;

          case FIELD_TYPE_CHECKBOX:
            curLabel = value ? item.placeholder : `非${item.placeholder}`;
            break;

          case FIELD_TYPE_DATETIME:
            curLabel = value ? formatDateLabel(value) : value;
            break;

          default:
            curLabel = value;
        }

        record._label = `${record._label}${index ? LABEL_DIVIDER : ''}${
          curLabel || '-'
        }`;
      });
console.log('===', record)
      return record;
    },

    onCreate() {
      const curVal = this.formatValue(this.form);
      console.log('==', this.form)
      this.form = {};
      this.values.push(curVal);
    },

    onDelete(record) {
      this.values = this.values.filter((item) => item._key !== record._key);
    },
  },
};
</script>

<style lang="scss" scoped>
.s-addable-form-group {
  &-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    & > div {
      margin: 0 8px 8px 0;
    }
    & > button {
      margin: 0 0 8px 8px;
    }
    & > label {
      margin: 0 0 8px 8px;
    }
  }

  &-values {
    ::v-deep {
      .ivu-tag-text {
        max-width: 400px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ivu-tag .ivu-icon-ios-close {
        top: 4px;
        float: right;
      }
    }
  }
}
</style>
