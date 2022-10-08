<script>
import JsonTable from './JsonTable.vue';
import Header from './Header';

export default {
  name: 'App',
  components: {
    JsonTable,
    Header,
  },
  methods: {
    add() {
      const category = this.$store.state.jsonFormStore.category;
      this.$refs.formEl.add(category !== 'component');
    },
  },
};
</script>

<template>
  <div
    px14
    pt6
    pb10
    box-border
    h-100vh
    overflow-auto
    style="background: rgb(246, 246, 249)"
  >
    <Header message="请在此处管理表单项" hide-back @add="add" @save="save" />
    <JsonTable ref="formEl">
      <slot />
    </JsonTable>
  </div>
</template>
