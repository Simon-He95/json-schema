<script>
import { formPage, MenuWrapper } from '@json-form/component';
export default {
  name: 'App',
  components: {
    formPage,
    MenuWrapper,
  },
  data() {
    return {
      current: {
        name: '',
        content: '',
      },
    };
  },
  mounted() {
    const { path } = this.$route;
    if (path.indexOf('groups') !== -1)
      this.current = { name: 'groups', content: 'Content-Type Builder' };
    else this.current = { name: 'submit', content: 'Content' };
  },
  methods: {
    triggerClick(data) {
      console.log('handler', data);
    },
    clickHandler(current) {
      this.current = current;
    },
  },
};
</script>

<template>
  <div id="json_form">
    <div items-start flex="~">
      <MenuWrapper :current="current" @clickItem="clickHandler" />
      <formPage :current="current"> </formPage>
    </div>
  </div>
</template>
