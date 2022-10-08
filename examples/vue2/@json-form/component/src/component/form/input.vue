<template>
  <div class="silent-input">
    <div class="silent-input-title">
      <label>{{ title }}</label>
    </div>
    <Input v-model="inputData" :placeholder="placeholder" />
  </div>
</template>

<script>
export default {
  name: 'SilentInput',

  data() {
    return {
      inputData: '',
    };
  },

  mounted() {},

  methods: {},

  props: ['title', 'placeholder'],

  watch: {
    inputData: {
      deep: true,
      handler(val) {
        this.$emit('changeInput', this.inputData);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  input {
    width: 180px;
    height: 26px;
  }
  .silent-input-title {
    position: absolute;
    width: 58px;
    border-right: 1px solid #aaa;
    z-index: 1;
    margin-top: 3px;
    text-align: center;
  }
  .ivu-input {
    border: solid 1px #7d7d83;
    &:focus {
      border: solid 1px #2d8cf0;
    }
  }
  .ivu-input-default {
    padding-left: 64px;
  }

  label {
    text-align: center;
    padding: 0 10px;
    color: #56565e;
    height: 20px;
    line-height: 20px;
  }
}
</style>
