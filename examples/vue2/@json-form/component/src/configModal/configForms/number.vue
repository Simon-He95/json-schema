<template>
  <div class="number-form">
    <!-- 基本配置 -->
    <Form
      :model="form"
      ref="form"
      label-position="left"
      v-show="active === TAB_BASIC"
    >
      <FormItem label="类型" prop="precision">
        <JFCheckableInput
          v-model="form.precision"
          type="number"
          label="小数"
        />
        <!-- <RadioGroup v-model="form.type">
          <Radio border v-for="(label, field) in numberTypes" :key="field" :label="field">
            <span>{{ label }}</span>
          </Radio>
        </RadioGroup> -->
      </FormItem>
    </Form>

    <!-- 高级配置 -->
    <Form
      :model="form"
      ref="advanceForm"
      label-position="left"
      v-show="active === TAB_ADVANCE"
    >
      <FormItem prop="max">
        <JFCheckableInput
          v-model="form.max"
          type="number"
          label="最大长度"
        />
      </FormItem>
      <FormItem prop="min">
        <JFCheckableInput
          v-model="form.min"
          type="number"
          label="最小长度"
        />
      </FormItem>
      <FormItem label="正则校验" prop="regExp" class="form-item-col-12">
        <JFAddableFormGroup
          v-model="form.regExp"
          :fields="regExpFields"
        ></JFAddableFormGroup>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {
  regExpFields,
  numberTypes,
  NUM_TYPE_INT,
} from '../../utils/options';
import { JFAddableFormGroup, JFCheckableInput } from '../../component';
import formMixin from './formMixin';

export default {
  name: 'NumberConfigForm',
  components: {
    JFAddableFormGroup,
    JFCheckableInput,
  },

  mixins: [formMixin],

  data() {
    this.numberTypes = numberTypes;
    this.regExpFields = regExpFields;

    return {
      form: {
        // type: NUM_TYPE_INT,
        precision: '',
        regExp: [],
        max: '',
        min: '',
      },
    };
  },

  methods: {},
};
</script>
