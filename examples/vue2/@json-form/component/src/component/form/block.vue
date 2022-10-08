<template>
  <div class="s-form-item-wrap">
    <label class="s-form-item-label">{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SilentFormBlock',
  props: {
    label: String,
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
