<template>
  <div class="date-form">
    <!-- 基本配置 -->
    <Form :model="form" :rules="formRules" ref="form" label-position="left" v-show="active === TAB_BASIC">
      <FormItem label="类型" prop="type">
        <Select v-model="form.type" placeholder="选择日期类型">
          <OptionGroup label="日期">
            <Option v-for="(label, field) of dateTypes" :value="field" :key="field">{{label}}</Option>
          </OptionGroup>
          <OptionGroup label="时间">
            <Option v-for="(label, field) of timeTypes" :value="field" :key="field">{{label}}</Option>
          </OptionGroup>
          <OptionGroup label="范围">
            <Option v-for="(label, field) of rangeTypes" :value="field" :key="field">{{label}}</Option>
          </OptionGroup>
        </Select>
      </FormItem>
    </Form>

    <!-- 高级配置 -->
    <Form
      :model="form"
      ref="advanceForm"
      label-position="left"
      v-show="active === TAB_ADVANCE"
    >
      <FormItem prop="formattor">
        <Select v-model="form.formattor" placeholder="选择格式化工具">
          <Option
            v-for="(label, field) of dateFormattors"
            :value="field"
            :key="field"
            >{{ label }}</Option
          >
        </Select>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { dateTypes, timeTypes, rangeTypes, dateFormattors } from '../../utils/options'
import formMixin from './formMixin'

export default {
  name: "DateConfigForm",

  mixins: [formMixin],

  data() {
    this.dateTypes = dateTypes
    this.timeTypes = timeTypes
    this.rangeTypes = rangeTypes
    this.dateFormattors = dateFormattors
    this.formRules = {
      type: [
        { required: true, message: '类型必选', trigger: 'blur' }
      ]
    }

    return {
      form: {
        type: '',
      },
    }
  },

  methods: {},
}
</script>
