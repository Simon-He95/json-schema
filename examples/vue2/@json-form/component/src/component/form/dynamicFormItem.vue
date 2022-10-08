<template>
  <div class="s-dynamic-basic" :style="{ width: field.width + 'px' || 'auto' }">
    <!-- 选择器 -->
    <Select
      v-if="field.type === selecType"
      v-model="innerValue"
      :placeholder="field.placeholder"
      :filterable="field.filterable"
      :multiple="field.multiple"
      :disabled="disabled"
    >
      <Option
        v-for="(label, value) in field.restriction"
        :value="value"
        :key="value"
        >{{ label }}</Option
      >
    </Select>

    <!-- 日期选择 -->
    <DatePicker
      v-else-if="dateTypes.includes(field.type)"
      v-model="innerValue"
      format="yyyy-MM-dd HH:mm:ss"
      :placeholder="field.placeholder"
      :type="field.type"
      :disabled="disabled"
    />

    <!-- 日期选择 -->
    <TimePicker
      v-else-if="timeTypes === field.type"
      v-model="innerValue"
      :placeholder="field.placeholder"
      :type="field.type"
      :disabled="disabled"
    />

    <!-- 多选框 -->
    <template v-else-if="checkboxTypes.includes(field.type)">
      <!-- TODO: 支持checkbox组 -->
      <Checkbox
        v-model="innerValue"
        :disabled="disabled"
        >{{ field.placeholder }}</Checkbox
      >
    </template>

    <!-- 输入框 -->
    <Input
      v-else
      v-model="innerValue"
      :placeholder="field.placeholder"
      :type="field.type"
      :disabled="disabled"
    />
  </div>
</template>

<script>
/**
 * 动态表单项生成组件
 */
import {
  FIELD_TYPES_DATE,
  FIELD_TYPE_SELECT,
  FIELD_TYPES_INPUT,
  FIELD_TYPE_CHECKBOX,
  FIELD_TYPE_TIME,
} from '@/utils/constant';
import { getJSONString } from '@/utils/utils';

export default {
  name: 'SilentDynamicFormItem',
  props: {
    field: {
      type: Object,
      default: () => {
        return {};
      },
    },
    key: String,
    value: String | Number,
    disabled: Boolean,
  },

  data() {
    this.dateTypes = FIELD_TYPES_DATE;
    this.timeTypes = FIELD_TYPE_TIME;
    this.selecType = FIELD_TYPE_SELECT;
    this.inputTypes = FIELD_TYPES_INPUT;
    this.checkboxTypes = FIELD_TYPE_CHECKBOX;

    return {
      innerValue: '',
    };
  },

  watch: {
    value: {
      deep: true,
      handler(val, prevVal) {
        if (getJSONString(val) !== getJSONString(prevVal)) {
          this.innerValue = val
        }
      },
    },

    innerValue: {
      deep: true,
      handler (val) {
        this.$emit('input', val)
      },
    }
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
.s-dynamic-basic {
  & > div {
    width: 100%;
  }
}
</style>
