<template>
  <div class="cascader-form">
    <!-- 基本配置 -->
    <Form
      :model="form"
      ref="form"
      label-position="left"
      v-show="active === TAB_BASIC"
    >
      <FormItem label="类型" prop="multiple">
        <RadioGroup v-model="form.multiple">
          <Radio
            border
            v-for="(label, field) in cascaderTypes"
            :label="field"
            :key="field"
            >{{ label }}</Radio
          >
        </RadioGroup>
      </FormItem>
      <FormItem label="选择项" prop="options" class="form-item-col-12">
        <Input
          v-model="form.options"
          type="textarea"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {
  cascaderTypes,
  CASCADER_TYPE_SINGLE,
} from '../../utils/options';
import formMixin from './formMixin';

export default {
  name: 'SelectConfigForm',

  mixins: [formMixin],

  data() {
    this.cascaderTypes = cascaderTypes;

    return {
      form: {
        multiple: CASCADER_TYPE_SINGLE,
        options: [],
      },
    };
  },

  methods: {},
};
</script>
