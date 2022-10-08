<template>
  <Poptip :popper-class="`command-poptip ${popperClass}`" v-bind="$attrs" v-on="$listeners">
    <template #content><slot name="content"></slot></template>
    <slot></slot>
  </Poptip>
</template>

<script>
export default {
  name: 'CommandPoptip',
  props: {
    popperClass: {
      type: String,
      default: '',
    }
  },
}
</script>

<style lang="scss">
@import "../../style/index.scss";

.command-poptip {
  &.ivu-poptip-popper {
    &[x-placement^=top] {
      .ivu-poptip-arrow {
        border-top-color: $command-border-color-primary;
  
        &:after {
          border-top-color: $command-bg-primary;
        }
      }
    }
  
    &[x-placement^=bottom] {
      .ivu-poptip-arrow {
        border-bottom-color: $command-border-color-primary;
  
        &:after {
          border-bottom-color: $command-bg-primary;
        }
      }
    }
  }

  .ivu-poptip-title:after {
    background-color: $command-border-color-primary;
  }

  .ivu-poptip-inner {
    box-shadow: $command-box-shadow;
    background-color: $command-bg-primary;
    border: 1px solid $command-border-color-primary;
  }
  
  .ivu-poptip-title-inner {
    font-size: $font-size-text;
    color: $command-text-color;
  }
}
</style>