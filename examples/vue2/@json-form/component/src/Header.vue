<script>
import { mapState } from 'vuex';
export default {
  name: 'Header',
  props: {
    type: {
      type: String,
      default: 'build',
    },
    message: {
      type: String,
      default: 'Build the data architecture of your content',
    },
    hideBack: Boolean,
  },
  computed: {
    ...mapState({
      current: (state) => state.jsonFormStore.current,
    }),
  },
  mounted() {
    console.log(this.$store);
  },
  methods: {
    add() {
      this.$emit('add');
    },
    save() {
      this.$emit('save');
    },
    drag() {
      this.$emit('drag');
    },
    create() {
      this.$emit('create');
    },
    edit() {
      this.$store.commit('jsonFormStore/createType', 'edit');
    },
  },
};
</script>

<template>
  <div h-38 text-left>
    <div data-strapi-header="true">
      <div v-if="!hideBack">
        <a
          aria-current="page"
          inline-flex
          items-center
          decoration-none
          class="active_text"
        >
          <Icon type="md-arrow-back" pr2 />
          <span style="color: rgb(73, 69, 255)" text-3 @click="$router.go(-1)"
            >返回</span
          >
        </a>
      </div>

      <div flex items-center justify-between>
        <div items-center flex>
          <div id="title" font-600 text-8 style="color: rgb(50, 50, 77)">
            {{ current.name }}
          </div>
          <div v-show="type === 'build'" pl4>
            <button
              aria-disabled="false"
              type="button"
              flex
              cursor-pointer
              border-rd-1
              items-center
              bg-white
              px4
              py2
              style="border: 1px solid rgb(220, 220, 228)"
              @click="edit"
            >
              <Icon type="md-create" pr2 />
              <span text-3 font-600 style="color: rgb(50, 50, 77)" lh-4
                >编辑</span
              >
            </button>
          </div>
        </div>
        <div items-center flex>
          <button
            v-show="type === 'build'"
            aria-disabled="false"
            type="button"
            items-center
            px4
            py2
            flex
            cursor-pointer
            border-rd-1
            style="border: 1px solid rgb(217, 216, 255)"
            bg-light-500
            hover:bg-white
            @click="add"
          >
            <Icon type="md-add" pr2 />
            <span font-600 text-3>新增</span>
          </button>
          <button
            v-show="type === 'manage'"
            aria-disabled="false"
            type="button"
            items-center
            px4
            py2
            flex
            cursor-pointer
            border-rd-1
            style="border: 1px solid rgb(217, 216, 255)"
            bg-light-500
            hover:bg-white
            @click="create"
          >
            <Icon type="md-add" pr2 />
            <span font-600 text-3>新增</span>
          </button>
        </div>
      </div>
      <div text-gray-400 text-4>
        {{ message }}
      </div>
    </div>
  </div>
</template>
