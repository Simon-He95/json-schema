<template>
  <Tag :class="['command-tag', `command-tag-${color}`]" :color="color"><slot></slot></Tag>
</template>

<script>
export default {
  name: 'CommandTag',
  props: {
    color: String,
  },
}
</script>

<style lang="scss" scoped>
@import "../../style/index.scss";

.command-tag {
  &-success-color {
    height: 26px;
    line-height: 26px;
    border-radius: $border-radius-md;
    background-color: $command-bg-success;
    border: none;
    font-weight: $font-weight-bold;

    ::v-deep {
      .ivu-tag-text {
        color: $command-success-color !important;
      }
    }
  }

  &-warning-color {
    height: 26px;
    line-height: 26px;
    border-radius: $border-radius-md;
    background-color: $command-bg-warning;
    border: none;
    font-weight: $font-weight-bold;

    ::v-deep {
      .ivu-tag-text {
        color: $command-warning-color !important;
      }
    }
  }

  &-danger-color {
    height: 26px;
    line-height: 26px;
    border-radius: $border-radius-md;
    background-color: $command-bg-danger;
    border: none;
    font-weight: $font-weight-bold;

    ::v-deep {
      .ivu-tag-text {
        color: $command-danger-color !important;
      }
    }
  }
}
</style>