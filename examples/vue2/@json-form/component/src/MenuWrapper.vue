<script>
import { mapState } from 'vuex';

export default {
  name: 'MenuWrapper',
  props: {
    current: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['click-list'],
  data() {
    return {
      title: 'groups',
    };
  },
  computed: {
    ...mapState({
      menuList: (state) => state.jsonFormStore.menuWrapper,
    }),
  },
  watch: {
    current() {
      this.title = this.current.name;
    },
  },
  mounted() {
    this.title = this.current.name;
  },
  methods: {
    clickHandler(title, content) {
      this.$emit('clickItem', {
        name: title,
        content,
      });
      // this.$store.commit('jsonFormStore/setMenu', title);
      this.title = title;
    },
  },
};
</script>

<template>
  <nav
    w-56
    bg-white
    sticky
    top-0
    h-100vh
    z-2
    border-r-1
    border-gray-100
    pt3
    pr2
    pl3
  >
    <ul text-left items-stretch flex flex-col list-none>
      <li v-for="(menu, i) in menuList" :key="menu.title">
        <a
          relative
          block
          border-rd-1
          :class="[
            i === 0
              ? title === 'submit'
                ? 'active_bg active_text'
                : 'regular'
              : title === 'groups'
              ? 'active_bg active_text'
              : 'regular',
          ]"
          @click="
            clickHandler(
              i === 0 ? 'submit' : 'groups',
              i === 0 ? 'Content' : 'Content-Type Builder'
            )
          "
        >
          <span flex items-center py2 px3>
            <Icon :type="menu.icon" pr2 text-3 />
            <span text-3>{{ menu.title }}</span>
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>
