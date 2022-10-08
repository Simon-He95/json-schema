<template>
  <JFModal
    class="command-config-modal"
    footerHide
    :visible="visible"
    title="查看详情"
    :loading="loading"
    @close="handleClose"
  >
    <json-viewer :value="dataSource" copyable boxed />
  </JFModal>
</template>

<script>
import JsonViewer from 'vue-json-viewer';
import { JFModal } from '../../component';

export default {
  name: 'DetailModal',
  components: {
    JFModal,
    JsonViewer,
  },
  props: {
    visible: Boolean,
    dataSource: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  methods: {
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/index.scss';
.command-config-modal {
  ::v-deep {
    .jv-container {
      font-size: $font-size-text;
    }
  }
}
</style>
