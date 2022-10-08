<template>
  <div class="switch-form">
    <!-- 高级配置 -->
    <Form
      :model="form"
      ref="advanceForm"
      label-position="left"
      v-show="active === TAB_ADVANCE"
    >
      <FormItem label="真值" prop="trueValue">
        <Input
          v-model="form.trueValue"
          placeholder="不填则默认值为true"
        ></Input>
      </FormItem>
      <FormItem label="假值" prop="falseValue">
        <Input
          v-model="form.falseValue"
          placeholder="不填则默认值为false"
        ></Input>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import formMixin from './formMixin';

export default {
  name: 'SwitchConfigForm',

  mixins: [formMixin],

  data() {
    return {
      form: {
        trueValue: '',
        falseValue: '',
      },
    };
  },

  methods: {},
};
</script>
