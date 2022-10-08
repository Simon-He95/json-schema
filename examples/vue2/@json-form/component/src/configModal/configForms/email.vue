<template>
  <div class="email-form">
    <!-- 高级配置 -->
    <Form
      :model="form"
      ref="advanceForm"
      label-position="left"
      v-show="active === TAB_ADVANCE"
    >
      <FormItem prop="max">
        <jf-checkable-input
          v-model="form.max"
          type="number"
          label="最大长度"
        />
      </FormItem>
      <FormItem prop="min">
        <jf-checkable-input
          v-model="form.min"
          type="number"
          label="最小长度"
        />
      </FormItem>
      <FormItem label="正则校验" prop="regExp" class="form-item-col-12">
        <jf-addable-form-group
          v-model="form.regExp"
          :fields="regExpFields"
        ></jf-addable-form-group>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { regExpFields } from '../../utils/options';
import { JFAddableFormGroup, JFCheckableInput } from '../../component';
import formMixin from './formMixin';

export default {
  name: 'EmailConfigForm',
  components: {
    JFAddableFormGroup,
    JFCheckableInput,
  },

  mixins: [formMixin],

  data() {
    this.regExpFields = regExpFields;

    return {
      form: {
        regExp: [],
        max: '',
        min: '',
      },
    };
  },

  methods: {},
};
</script>
