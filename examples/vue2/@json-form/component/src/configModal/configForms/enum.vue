<template>
  <div class="enum-form">
    <!-- 基本配置 -->
    <Form :model="form" ref="form" label-position="left" v-show="active === TAB_BASIC">
      <FormItem label="类型" prop="type">
        <RadioGroup v-model="form.type">
          <Radio border v-for="(label, field) in enumTypes" :label="field" :key="field">{{label}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="选择项" prop="options" class="form-item-col-12">
        <JFAddableFormGroup v-model="form.options" :fields="optionsFields"></JFAddableFormGroup>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { enumTypes, optionsFields, ENUM_TYPE_SINGLE } from '../../utils/options'
import { JFAddableFormGroup } from '../../component'
import formMixin from './formMixin'

export default {
  name: "EnumConfigForm",
  components: {
    JFAddableFormGroup,
  },

  mixins: [formMixin],

  data() {
    this.enumTypes = enumTypes
    this.optionsFields = optionsFields

    return {
      form: {
        type: ENUM_TYPE_SINGLE,
        options: [],
      },
    }
  },

  methods: {},
}
</script>
