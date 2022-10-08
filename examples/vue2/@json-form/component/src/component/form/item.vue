<template>
  <div
    :class="['s-form-item', isFlex ? 's-form-item-flex' : '']"
    :style="{ width: width + 'px' || 'auto' }"
    @mousedown="onMousedown"
  >
    <Tooltip
      :disabled="!visible"
      :always="visible"
      :placement="placement"
      :content="message"
    >
      <template #content>
        <div v-html="safeMessage"></div>
      </template>
      <slot></slot>
    </Tooltip>
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    message: String,
    field: String,
    isFlex: Boolean,
    width: Number,
    placement: {
      type: String,
      default: 'right',
    },
  },

  computed: {
    visible() {
      return !!this.message;
    },

    safeMessage() {
      let finalMessage = this.message;

      if (!finalMessage) return finalMessage;

      const replaceList = [
        ['<a', '&#60;&#97;'],
        ['<script', '&#60;&#115;&#99;&#114;&#105;&#112;&#116;'],
        ['(', '&#40;'],
        [')', '&#41;'],
      ];
      replaceList.forEach(([key, val]) => {
        finalMessage = finalMessage.replace(key, val);
      });

      return finalMessage;
    },
  },

  methods: {
    onMousedown() {
      this.$emit('clear', this.field);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
