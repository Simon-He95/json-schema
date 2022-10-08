<template>
  <div class="input-form">
    <!-- 基本配置 -->
    <Form :model="form" ref="form" label-position="left" v-show="active === TAB_BASIC">
      <FormItem label="类型" prop="type" class="form-item-col-12 input-form-item-type">
        <RadioGroup v-model="form.type">
          <Radio border v-for="(item, field) in inputTypes" :label="field" :key="field">
            <div>
              <label>{{item.title}}</label>
              <p>{{item.desc}}</p>
            </div>
          </Radio>
        </RadioGroup>
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
import { INPUT_TYPE_TEXT, regExpFields, inputTypes } from '../../utils/options'
import { JFAddableFormGroup, JFCheckableInput } from '../../component'
import formMixin from './formMixin'

export default {
  name: "InputConfigForm",
  components: {
    JFAddableFormGroup,
    JFCheckableInput,
  },

  mixins: [formMixin],

  data() {
    this.inputTypes = inputTypes
    this.regExpFields = regExpFields

    return {
      form: {
        type: INPUT_TYPE_TEXT,
        regExp: [],
        max: '',
        min: '',
      },
    }
  },

  methods: {},
}
</script>

<style lang="scss" scoped>
  @import "../../style/index.scss";
  .input-form {
    &-item-type {
      
      ::v-deep {
        .ivu-radio-group {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
          width: 100%;
        }
        .ivu-radio-border {
          grid-column: span 6 / auto;
          display: flex;
          align-items: center;
          height: auto;
          margin: 0;
          padding: 16px;

          .ivu-radio {
            flex-shrink: 0;
            flex-grow: 0;
            margin-right: 16px;
          }

          & > div {
            line-height: 1;

            & > label {
              font-weight: $font-weight-bold;
              color: $command-text-color;
              line-height: 1.3;
            }
  
            & > p {
              margin-top: 8px;
              font-weight: $font-weight-light;
              font-size: $font-size-text;
              color: $command-subtext-color;
              line-height: 1.5;
            }
          }

          &.ivu-radio-wrapper-checked {
            & > div {
              & > label,
              & > p {
                color: $command-primary-color;
              }
            }
          }
        }
      }
    }
  }
</style>
