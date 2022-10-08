<script>
import { mapState } from 'vuex';
import JsonForm from './JsonForm.vue';
import { JFLoading } from './component';
import Header from './modules/header';

export default {
  name: 'App',
  components: {
    Header,
    JsonForm,
    JFLoading,
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState({
      loading: (state) => state.jsonFormStore.loading,
      current: (state) => state.jsonFormStore.current,
    }),
  },
  methods: {
    back() {
      this.$emit('back');
    },
  },
};
</script>

<template>
  <div relative h-100vh overflow-auto w-full class="jf-single">
    <JFLoading v-if="loading" />
    <template v-else>
      <div pb-8>
        <div flex items-center pb-3 class="active_text">
          <Icon type="md-arrow-back" pr2 />
          <span text-3 @click="back">返回</span>
        </div>
        <div flex items-center justify-between>
          <h1 font-600 text-8 lh-5 style="color: rgb(50, 50, 77)">
            {{ current.name }}
          </h1>
          <div>
            <slot :formRef="$refs.jsonFormEl"></slot>
          </div>
        </div>
      </div>

      <!-- <Header :title="current.name" hasBack>
        <template #opts>
          <Button type="primary" @click="createForm">
            <Icon type="ios-paper-plane" />发送
          </Button>
        </template>
      </Header> -->

      <JsonForm
        ref="jsonFormEl"
        :data="tableData"
        border-rd-2
        brder-1
        border-gray
        bg-white
        p6
        style="box-shadow: rgb(33 33 52 / 10%) 0px 1px 4px"
      ></JsonForm>
    </template>
  </div>
</template>
