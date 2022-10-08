<script>
import Menu from './Menu';
import myGroup from './groups.vue';
import myForm from './form.vue';
import { mapState } from 'vuex';
import './style/index.scss';

export default {
  name: 'App',
  components: {
    Menu,
    myForm,
    myGroup,
  },
  props: {
    current: {
      type: Object,
      default: () => ({ name: 'group', content: 'Content-Type Builder' }),
    },
    menuList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      id: '',
    };
  },
  computed: {
    ...mapState({
      currentId: (state) => state.jsonFormStore.current,
    }),
  },
  watch: {
    current(current) {
      if (!current) return;
      const {
        params: { id },
        path,
      } = this.$route;
      const { name } = current;
      if (path.indexOf(name) === -1) this.$router.push(`../${name}/${id}`);
    },
    currentId(current) {
      this.id = current.id;
    },
  },
  mounted() {
    const {
      params: { id },
    } = this.$route;
    this.id = id && id !== 'index' ? id : '';
  },
};
</script>

<template>
  <div id="formpage" w-full grid grid-cols="[auto_1fr]" class="menu_bg">
    <Menu :target="current" :menu-list="menuList" />
    <!-- template builder -->
    <template v-if="id">
      <myGroup v-if="current && current.name === 'groups'">
        <slot></slot>
      </myGroup>
      <!-- form sender -->
      <myForm v-else>
        <slot></slot>
      </myForm>
    </template>
  </div>
</template>
