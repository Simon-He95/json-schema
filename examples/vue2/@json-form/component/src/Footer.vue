<script>
import { mapState } from 'vuex';
export default {
  name: 'Footer',
  emits: ['cancel', 'confirm'],
  data: function () {
    return {
      modal: false,
    };
  },
  computed: {
    ...mapState({
      createType: (state) => state.jsonFormStore.createType,
    }),
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$emit('confirm');
    },
    deleteHandler() {
      this.$emit('delete');
    },
    asyncOK() {
      this.deleteHandler();
    },
  },
};
</script>

<template>
  <div
    p4
    style="
      background: rgb(246, 246, 249);
      border-radius: 0px 0px 4px 4px;
      border-top: 1px solid rgb(234, 234, 239);
    "
  >
    <div align-center flex justify-between>
      <div align-center flex>
        <button
          aria-disabled="false"
          type="button"
          bg-white
          style="border: 1px solid rgb(220, 220, 228)"
          p2
          border-rd-1
          cursor-pointer
          @click="cancel"
        >
          <span font-600 text-3 style="color: rgb(50, 50, 77)">取消</span>
        </button>
      </div>
      <div align-center flex justify-between>
        <button
          v-show="createType === 'edit'"
          aria-disabled="false"
          type="submit"
          px4
          py2
          style="
            border: 1px solid rgb(208, 43, 32);
            background: rgb(208, 43, 32);
          "
          border-rd-1
          @click="modal = true"
        >
          <span font-600 text-3 color-white>删除</span>
        </button>
        <button
          aria-disabled="false"
          type="submit"
          px4
          py2
          border-rd-1
          style="
            border: 1px solid rgb(217, 216, 255);
            background: rgb(240, 240, 255);
          "
          cursor-pointer
          @click="confirm"
        >
          <span style="color: rgb(39, 31, 224)" text-3 font-600>确认</span>
        </button>
      </div>
    </div>
    <Modal v-model="modal" title="Title" @on-ok="asyncOK">
      <p>删除前，请先移除Content Manager中对应表</p>
    </Modal>
  </div>
</template>
