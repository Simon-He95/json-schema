<template>
  <div class="s-form-wrap" :style="{ width: width }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SilentForm',
  props: {
    width: String,
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
