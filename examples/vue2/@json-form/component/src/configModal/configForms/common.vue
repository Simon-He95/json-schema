<template>
  <div class="common-form">
    <!-- 基本配置 -->
    <Form
      :model="form"
      :rules="formRules"
      ref="form"
      label-position="left"
      v-show="active === TAB_BASIC"
    >
      <FormItem label="名称" prop="label">
        <Input
          v-model="form.label"
          placeholder="不填则表单项不展示名称"
        ></Input>
      </FormItem>
      <FormItem label="键名" prop="key">
        <Input
          v-model="form.key"
          placeholder="最终用于保存数据的字段名"
        ></Input>
      </FormItem>
      <FormItem label="占位文字" prop="placeholder">
        <Input
          v-model="form.placeholder"
          placeholder="表单项未输入值时用于占位的文字"
        ></Input>
      </FormItem>
      <FormItem label="描述" prop="description">
        <Input v-model="form.description"></Input>
      </FormItem>
    </Form>

    <!-- 高级配置 -->
    <Form
      :model="form"
      ref="advanceForm"
      label-position="left"
      v-show="active === TAB_ADVANCE"
    >
      <FormItem label="默认值" prop="defaultValue">
        <Input
          v-model="form.defaultValue"
          placeholder="不填则默认值为空"
        ></Input>
      </FormItem>
      <FormItem label="键名映射" prop="mapKey">
        <Input v-model="form.mapKey" placeholder="用于映射键名"></Input>
      </FormItem>

      <!-- 显隐关联 -->
      <FormItem
        label="显隐关联（满足以下条件时隐藏）"
        prop="hide"
        class="form-item-col-12"
      >
        <JFAddableFormGroup
          v-model="form.hide"
          :fields="hideFields"
        ></JFAddableFormGroup>
      </FormItem>

      <!-- TODO: 编辑时disabled -->

      <h6 class="form-item-col-12">更多设置</h6>
      <FormItem prop="required">
        <Checkbox v-model="form.required">必填</Checkbox>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { hideFields } from '../../utils/options';
import { JFAddableFormGroup } from '../../component';
import formMixin from './formMixin';

export default {
  name: 'CommonConfigForm',
  components: {
    JFAddableFormGroup,
  },

  mixins: [formMixin],

  data() {
    this.formRules = {
      key: [{ required: true, message: '键名必填', trigger: 'blur' }],
    };
    this.hideFields = hideFields;

    return {
      form: {
        label: '',
        key: '',
        placeholder: '',
        description: '',
        defaultValue: '',
        mapKey: '',
        hide: [],
        required: false,
      },
    };
  },

  methods: {},
};
</script>
