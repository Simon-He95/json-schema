<template>
  <JFModal
    class="command-config-modal"
    :visible="visible"
    :title="title"
    :loading="loading"
    :footerHide="footerHide"
    @close="handleClose"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <template #title>
      <div
        class="command-config-title"
        v-if="step === COMMAND_STEP_TYPE_SELECT"
      >
        <label>表单配置</label>
        <span>{{ currentData && currentData.name }}</span>
      </div>

      <div class="command-config-title" v-else>
        <jf-icon :icon="configTitle.icon" /><span>{{
          configTitle.name
        }}</span>
      </div>
    </template>

    <div class="command-config-modal-footer" slot="footer" v-if="form.id">
      <Button type="error" @click="onDelete">删除</Button>
    </div>

    <!-- step1: 选择类型 -->
    <div class="command-config-type" v-show="step === COMMAND_STEP_TYPE_SELECT">
      <h5>请选择表单项类型</h5>
      <hr />

      <h6>基础组件</h6>
      <JFItemCard :data-source="basicFormItems" @select="onSelect" />

      <h6>业务组件</h6>
      <JFItemCard :data-source="customFormItems" @select="onSelect" />
    </div>

    <!-- step2: 配置表单项 -->
    <div class="command-config-form" v-show="step === COMMAND_STEP_CONFIG">
      <Tabs v-model="activeTab">
        <TabPane
          v-for="(label, value) in configTabs"
          :key="value"
          :name="value"
          :label="label"
        ></TabPane>
        <template #extra>
          <h5 class="command-config-form-title">配置表单项参数</h5>
        </template>
      </Tabs>

      <!-- 公共表单 -->
      <common-config-form
        :default-value="form"
        :active="activeTab"
        ref="commonFormRef"
      />

      <!-- 私有表单/input -->
      <input-config-form
        :default-value="form"
        :active="activeTab"
        ref="privateFormRef"
        v-if="type === BASIC_COMP_INPUT"
      />

      <!-- 私有表单/richtext -->
      <richtext-config-form
        :default-value="form"
        :active="activeTab"
        ref="privateFormRef"
        v-if="type === BASIC_COMP_RICHTEXT"
      />

      <!-- 私有表单/email -->
      <email-config-form
        :default-value="form"
        :active="activeTab"
        ref="privateFormRef"
        v-if="type === BASIC_COMP_EMAIL"
      />

      <!-- 私有表单/phone -->
      <phone-config-form
        :default-value="form"
        :active="activeTab"
        ref="privateFormRef"
        v-if="type === BASIC_COMP_PHONE"
      />

      <!-- 私有表单/password -->
      <password-config-form
        :default-value="form"
        :active="activeTab"
        ref="privateFormRef"
        v-if="type === BASIC_COMP_PASSWORD"
      />

      <!-- 私有表单/number -->
      <number-config-form
        :default-value="form"
        :active="activeTab"
        ref="privateFormRef"
        v-if="type === BASIC_COMP_NUMBER"
      />

      <!-- 私有表单/date -->
      <date-config-form :default-value="form" :active="activeTab" ref="privateFormRef" v-if="type === BASIC_COMP_DATE" />

      <!-- 私有表单/select -->
      <select-config-form :default-value="form" :active="activeTab" ref="privateFormRef" v-if="type === BASIC_COMP_SELECT" />

      <!-- 私有表单/enum -->
      <enum-config-form :default-value="form" :active="activeTab" ref="privateFormRef" v-if="type === BASIC_COMP_ENUM" />
      
      <!-- 私有表单/cascader -->
      <cascader-config-form
        :default-value="form"
        :active="activeTab"
        ref="privateFormRef"
        v-if="type === BASIC_COMP_CASCADER"
      />

      <!-- 私有表单/switch -->
      <switch-config-form
        :default-value="form"
        :active="activeTab"
        ref="privateFormRef"
        v-if="type === BASIC_COMP_SWITCH"
      />
    </div>
  </JFModal>
</template>

<script>
import { JFIcon, JFItemCard, JFModal } from '../component';
import {
  CommonConfigForm,
  InputConfigForm,
  RichtextConfigForm,
  EmailConfigForm,
  PhoneConfigForm,
  PasswordConfigForm,
  NumberConfigForm,
  DateConfigForm,
  SelectConfigForm,
  EnumConfigForm,
  CascaderConfigForm,
  SwitchConfigForm,
} from './configForms';
import {
  COMMAND_STEP_TYPE_SELECT,
  COMMAND_STEP_CONFIG,
} from '../utils/constant';
import {
  basicFormItems,
  customFormItems,
  configTabs,
  TAB_BASIC,
  BASIC_COMP_INPUT,
  BASIC_COMP_RICHTEXT,
  BASIC_COMP_EMAIL,
  BASIC_COMP_PHONE,
  BASIC_COMP_PASSWORD,
  BASIC_COMP_NUMBER,
  BASIC_COMP_DATE,
  BASIC_COMP_SELECT,
  BASIC_COMP_ENUM,
  BASIC_COMP_CASCADER,
  BASIC_COMP_SWITCH,
} from '../utils/options';
import { isUef } from '../utils/type';
import { safeCallRef, getRandomUid } from '../utils/utils';
import formattorMixin from './formattorMixin'

export default {
  name: 'ConfigModal',
  components: {
    JFIcon,
    JFModal,
    JFItemCard,
    CommonConfigForm,
    InputConfigForm,
    RichtextConfigForm,
    EmailConfigForm,
    PhoneConfigForm,
    PasswordConfigForm,
    NumberConfigForm,
    DateConfigForm,
    SelectConfigForm,
    EnumConfigForm,
    CascaderConfigForm,
    SwitchConfigForm,
  },
  props: {
    defaultStep: Number,
    title: String,
    visible: Boolean,
    loading: Boolean,
    dataSource: Object,
    currentData: Object,
  },

  mixins: [formattorMixin],

  watch: {
    defaultStep: {
      deep: true,
      handler(val) {
        console.log('====step', val);
        this.step = val;
      },
    },

    type(val) {
      console.log('==', val);
    },

    visible(val) {
      if (!val) {
        this.reset();
      }
    },

    dataSource: {
      deep: true,
      handler(val) {
        if (val && val.component) {
          this.type = val.component;
        }
        this.$nextTick(() => {
          this.form = this.dataSource;
        })
      },
    },
  },

  data() {
    this.BASIC_COMP_INPUT = BASIC_COMP_INPUT;
    this.BASIC_COMP_RICHTEXT = BASIC_COMP_RICHTEXT;
    this.BASIC_COMP_EMAIL = BASIC_COMP_EMAIL;
    this.BASIC_COMP_PHONE = BASIC_COMP_PHONE;
    this.BASIC_COMP_PASSWORD = BASIC_COMP_PASSWORD;
    this.BASIC_COMP_NUMBER = BASIC_COMP_NUMBER;
    this.BASIC_COMP_DATE = BASIC_COMP_DATE;
    this.BASIC_COMP_SELECT = BASIC_COMP_SELECT;
    this.BASIC_COMP_ENUM = BASIC_COMP_ENUM;
    this.BASIC_COMP_CASCADER = BASIC_COMP_CASCADER;
    this.BASIC_COMP_SWITCH = BASIC_COMP_SWITCH;
    this.COMMAND_STEP_CONFIG = COMMAND_STEP_CONFIG;
    this.COMMAND_STEP_TYPE_SELECT = COMMAND_STEP_TYPE_SELECT;
    this.basicFormItems = basicFormItems;
    this.customFormItems = customFormItems;
    this.configTabs = configTabs;

    return {
      footerHide: false,
      step: COMMAND_STEP_TYPE_SELECT,
      type: '',
      activeTab: TAB_BASIC,
      form: {},
    };
  },

  computed: {
    configTitle() {
      const type = this.type;
      const map = basicFormItems[type] || customFormItems[type];
      return map || {};
    },
  },

  methods: {
    // 重置配置弹窗状态
    reset() {
      safeCallRef(this.$refs.commonFormRef, 'resetForm');
      safeCallRef(this.$refs.privateFormRef, 'resetForm');
      this.activeTab = TAB_BASIC;
      this.type = ''
      this.$nextTick(() => {
        if (this.defaultStep === COMMAND_STEP_TYPE_SELECT)
          this.step = COMMAND_STEP_TYPE_SELECT;
      });
    },

    handleClose() {
      this.$emit('close');
    },

    onSelect(field) {
      this.type = field;
      this.step = COMMAND_STEP_CONFIG;
    },

    // 校验表单&收集值
    async validateForms() {
      const commonResult = await safeCallRef(
        this.$refs.commonFormRef,
        'validateValues',
        Promise.resolve({})
      );
      const specialResult = await safeCallRef(
        this.$refs.privateFormRef,
        'validateValues',
        Promise.resolve({})
      );
      return {
        ...(commonResult || {}),
        ...(specialResult || {}),
      };
    },

    handleOk() {
      this.validateForms()
        .then((res) => {
          const values = {
            component: this.type,
            ...res,
          };

          // if (isUef(values.id)) values.id = getRandomUid()

          const formarttedValues = this.formatComponent(values)

          this.$emit('submit', formarttedValues);
        })
        .catch((err) => {
          console.log('==error', err);
        });
    },

    onDelete () {
      this.$emit('delete', this.dataSource)
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../style/index.scss';
.command-config {
  &-title {
    position: relative;
    display: flex;
    align-items: center;
    height: 22px;

    & > label {
      display: block;
      margin-top: -1px;
      padding: 4px 8px;
      border-radius: $border-radius-md;
      font-size: $font-size-text;
      font-weight: $font-weight-bold;
      background-color: $command-primary-color;
      color: $white-001;
      transform: scale(0.8);
      transform-origin: left center;
    }

    & > span {
      margin-left: 8px;
    }

    ::v-deep {
      .jf-icon {
        width: 30px;
        height: 22px;
        margin-right: 8px;
      }
    }
  }

  &-type {
    & > h5 {
      font-size: $command-font-size-title-scd;
    }
    & > hr {
      width: 100%;
      height: 1px;
      margin-top: 12px;
      border: none;
      background-color: $command-bg-dark;
    }

    & > h6 {
      margin: 16px 0;
      font-size: $command-font-size-title-sub;
    }
  }

  &-form {
    &-title {
      font-size: $command-font-size-title-scd;
      color: $command-text-color;
    }

    ::v-deep {
      .ivu-tabs-nav-right {
        float: left;
      }
      .ivu-tabs-nav {
        float: right;
      }
      .ivu-tabs-nav .ivu-tabs-tab {
        padding: 12px 16px;
        color: $command-subtext-color;
        font-weight: $font-weight-bold;
        font-size: $font-size-text;
      }
      .ivu-tabs-bar {
        border-color: $command-bg-dark;
      }
      .ivu-tabs-nav .ivu-tabs-tab-active {
        color: $command-primary-color;
      }
      .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: $command-primary-color;
      }
      .ivu-tabs-ink-bar {
        background-color: $command-primary-color;
      }

      h6 {
        margin: 8px 0;
        color: $command-text-color;
        font-size: $command-font-size-title-sub;
      }

      .common-form {
        margin-bottom: 16px;
      }
    }
  }

  &-modal-footer {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    ::v-deep {
      .ivu-btn {
        margin-right: 16px;
      }
    }
  }
}
</style>
