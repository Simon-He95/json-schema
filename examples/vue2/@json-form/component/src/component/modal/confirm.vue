<template>
  <Modal
    v-model="modalVisible"
    class="command-confirm-modal"
    :ok-text="okText"
    :cancel-text="cancelText"
    :width="width"
    :footer-hide="true"
    @on-visible-change="onVisibleChange"
  >
    <template v-slot:header></template>

    <div class="command-modal-body">
      <div class="command-modal-header">
        <Icon
          :class="[
            type === 'info' ? 'ivu-icon-ios-info' : 'ivu-icon-ios-warning',
          ]"
          type="ios-alert"
          v-if="type === 'info' || type === 'warning'"
        />
        <Icon type="ios-checkmark-circle" v-if="type === 'success'" />
        <Icon type="ios-close-circle" v-if="type === 'error'" />
        <div class="command-modal-title">{{ title }}</div>
      </div>
      <div class="command-modal-content">{{ content }}</div>
    </div>

    <div class="command-modal-footer" v-if="!footerHide">
      <Button class="command-modal-ok-btn" type="secondary" @click="onOk">{{
        okText
      }}</Button>
      <slot name="footer"></slot>
      <Button class="command-modal-cancel-btn" @click="onCancel">{{
        cancelText
      }}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'CommandConfirmModal',
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
    content: String,
    visible: Boolean,
    type: String,
    width: {
      type: Number,
      default: 430,
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
$size: 30px;
$interval: 10px;
.command-confirm-modal {
  color: $command-text-color;
  border: $border-radius-md;
  vertical-align: middle;

  .command-modal-body {
    .command-modal-header {
      display: flex;
      padding: 16px 16px;

      .ivu-icon {
        font-size: $size;

        &-ios-info {
          color: $command-primary-color;
        }

        &-ios-warning {
          color: $command-warning-color;
        }

        &-ios-checkmark-circle {
          color: $command-success-color;
        }

        &-ios-close-circle {
          color: $command-danger-color;
        }
      }

      .command-modal-title {
        margin-left: $interval;
        font-size: $command-font-size-title-sub;
        font-weight: $font-weight-bold;
        line-height: $size;
      }
    }
    .command-modal-content {
      font-size: 12px;
      margin: 0 (16px + $size + $interval) 20px (16px + $size + $interval);
    }
  }

  .command-modal-footer {
    display: flex;
    flex-direction: row-reverse;
    padding: 20px 20px 10px;

    .command-modal-cancel-btn {
      margin-right: 10px;
    }
  }

  ::v-deep {
    .ivu-modal-mask {
      background-color: $command-bg-modal;
    }
  }

  @include buttonRewrite;
}
</style>
