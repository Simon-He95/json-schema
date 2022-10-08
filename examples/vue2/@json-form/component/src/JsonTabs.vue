<script>
import { Icon } from '@iconify/vue2';
export default {
  name: 'JsonTabs',
  components: {
    Icon,
  },
  props: {
    types: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['choose'],
  methods: {
    clickHandler(type) {
      this.$emit('choose', type);
    },
  },
};
</script>

<template>
  <div grid grid-cols-12 gap2>
    <div v-for="i in types" :key="i.name" style="grid-column: span 6 / auto">
      <button
        type="button"
        p4
        border-rd-1
        bg-white
        w-full
        h-full
        border-1
        border-color-gray-300
        @click="clickHandler(i.value)"
      >
        <div flex items-center>
          <Icon :icon="i.icon" text-6 text-gray-500 />
          <div pl4 text-left>
            <div font-600 text="3.5" text-gray-500>
              {{ i.name }}
            </div>
            <div text-gray-400 text-3>
              {{ i.description }}
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
