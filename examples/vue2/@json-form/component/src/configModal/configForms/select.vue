<template>
  <div class="select-form">
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
            v-for="(label, field) in selectTypes"
            :label="field"
            :key="field"
            >{{ label }}</Radio
          >
        </RadioGroup>
      </FormItem>
      <FormItem label="选择项" prop="options" class="form-item-col-12">
        <jf-addable-form-group v-model="form.options" :fields="optionsFields"></jf-addable-form-group>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { selectTypes, optionsFields, SELECT_TYPE_SINGLE } from '../../utils/options'
import { JFAddableFormGroup } from '../../component'
import formMixin from './formMixin'

export default {
  name: "SelectConfigForm",
  components: {
    JFAddableFormGroup,
  },

  mixins: [formMixin],

  data() {
    this.selectTypes = selectTypes
    this.optionsFields = optionsFields

    return {
      form: {
        multiple: SELECT_TYPE_SINGLE,
        options: [],
      },
    }
  },

  methods: {},
}
</script>
