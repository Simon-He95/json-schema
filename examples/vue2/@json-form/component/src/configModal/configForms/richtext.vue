<template>
  <div class="richtext-form">
    <!-- 基本配置 -->
    <Form :model="form" ref="form" label-position="left" v-show="active === TAB_BASIC">
      <FormItem label="工具" prop="type" class="form-item-col-12 input-form-item-type">
        <CheckboxGroup v-model="form.tool">
          <Checkbox border v-for="(label, field) in richtextTypes" :label="field" :key="field">{{label}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { richtextTypes } from '../../utils/options'
import formMixin from './formMixin'

export default {
  name: "RichTextConfigForm",

  mixins: [formMixin],

  data() {
    this.richtextTypes = richtextTypes

    return {
      form: {
        tool: [],
      },
    }
  },

  methods: {},
}
</script>
