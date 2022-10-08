<template>
  <Modal
    v-model="modalVisible"
    class="command-modal"
    :ok-text="okText"
    :cancel-text="cancelText"
    :title="title"
    :width="width"
    :footer-hide="true"
    @on-visible-change="onVisibleChange"
  >
    <template v-slot:header v-if="$slots.title">
      <div class="ivu-modal-header-inner">
        <slot name="title"></slot>
      </div>
    </template>
    <div class="command-modal-body">
      <slot></slot>
    </div>

    <div class="command-modal-footer" v-if="!footerHide">
      <Button class="command-modal-cancel-btn" @click="onCancel">{{
        cancelText
      }}</Button>
      <slot name="footer"></slot>
      <Button class="command-modal-ok-btn" type="secondary" @click="onOk">{{
        okText
      }}</Button>

      <div class="command-modal-loading" v-if="loading">
        <Spin />
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'JFModal',
  props: {
    okText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    title: String,
    visible: Boolean,
    loading: Boolean,
    footerHide: Boolean,
    width: {
      type: Number,
      default: 830,
    },
  },

  data() {
    return {
      modalVisible: this.visible,
    };
  },

  watch: {
    visible: {
      deep: true,
      handler(val) {
        this.modalVisible = val;
      },
    },
  },

  methods: {
    onOk() {
      this.$emit('ok');
    },

    onCancel() {
      this.$emit('cancel');
    },

    onVisibleChange(val) {
      if (!val) this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/index.scss';
.command-modal {
  &-body {
    max-height: calc(100vh - 300px);
    padding: 32px;
    overflow-y: auto;
  }

  &-footer {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom-left-radius: $border-radius-md;
    border-bottom-right-radius: $border-radius-md;
    background-color: $command-bg;
  }

  &-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $command-bg-mask;
    ::v-deep {
      .ivu-spin-dot {
        background-color: $command-primary-color;
      }
      .ivu-spin {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }
    }
  }
  ::v-deep {
    // modal rewrite
    .ivu-modal-mask {
      background-color: $command-bg-modal;
    }

    .ivu-modal-header {
      padding: 16px 20px;
      border-top-left-radius: $border-radius-md;
      border-top-right-radius: $border-radius-md;
      background-color: $command-bg;
    }

    .ivu-modal-header-inner {
      display: block;
      height: auto;
      color: $command-text-color;
      font-size: $command-font-size-title-sub;
      font-weight: $font-weight-bold;
      overflow: visible;
    }

    .ivu-modal-close {
      top: 11px;
      right: 20px;
      border: 1px solid $command-border-color;
      background-color: $white-001;
      border-radius: $border-radius-md;

      .ivu-icon-ios-close {
        top: 0px;
        font-size: 28px;
      }
    }

    .ivu-modal-body {
      padding: 0;
    }

    .ivu-btn {
      padding: 0 16px;
    }

    // form rewrite
    .ivu-form {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 16px;
    }

    .ivu-form-item {
      grid-column: span 6 / auto;
      max-width: 100%;
      margin-bottom: 8px;
    }

    .form-item-col-12 {
      grid-column: span 12 / auto;
    }
    @include buttonRewrite;
    @include formRewrite;
  }
}
</style>
