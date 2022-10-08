<script>
import {
  FormGroupCreate,
  FormFields,
  FormGroupRemove,
  FormSubmits,
  FormGroupUpdate,
  FormGroups,
} from '../graphql/form.gql';
import { nanoid } from 'nanoid';
import { mapState, mapGetters } from 'vuex';
import Footer from './Footer';
import vueJsonEditor from 'vue-json-editor';

export default {
  name: 'Menu',
  components: {
    Footer,
    vueJsonEditor,
  },
  props: {
    target: {
      type: Object,
      default: () => ({}),
    },
    menuList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      component: '',
      createShow: false,
      name: '',
      types: {
        base: {
          title: 'base',
          content: 'create new collection type',
          list: [],
          collpase: true,
        },
        single: {
          title: 'single',
          content: 'create new single type',
          list: [],
          collpase: true,
        },
      },
      commonList: {},
      collpase: true,
      blockTitle: '',
      tempList: [],
      json: {
        msg: 'demo of jsoneditor',
      },
      title: '',
      id: '',
      once: false,
      commonAdd: '',
      singleAdd: '',
      baseAdd: '',
      common: {
        title: 'common',
        content: 'create new collection type',
      },
    };
  },
  computed: {
    modalTitle() {
      return 'Create new ' + this.blockTitle?.toLocaleLowerCase();
    },
    ...mapState({
      loading: (state) => state.jsonFormStore.loading,
      current: (state) => state.jsonFormStore.current,
      currentMenu: (state) => state.jsonFormStore.currentMenu,
      commonList: (state) => state.jsonFormStore.commonList,
      baseList: (state) => state.jsonFormStore.baseList,
      singleList: (state) => state.jsonFormStore.singleList,
      createType: (state) => state.jsonFormStore.createType,
      menuRefresher: (state) => state.jsonFormStore.menuRefresher,
    }),
    ...mapGetters({
      program: 'system/program',
      permission: 'system/permission',
      identity: 'system/identity',
    }),
    variables() {
      let v = {
        system: this.identity,
        first: 50,
        page: 1,
        order_by: '[{ field: "id", order: DESC }]',
      };
      return v;
    },
  },
  watch: {
    identity() {
      this.$store.commit('jsonFormStore/setCurrent', {});
      this.$store.commit('jsonFormStore/menuRefresher', true);
    },
    target(target) {
      if (!target) return;
      this.title = target.name;
      this.$store.commit('jsonFormStore/setCurrent', {});
      this.$store.commit('jsonFormStore/menuRefresher', true);
    },
    loading(loading) {
      if (!loading) return;
      this.querySearch();
    },
    title() {
      this.types.base.collpase = true;
      this.types.single.collpase = true;
    },
    commonList() {
      this.updateData();
    },
    baseList() {
      this.updateData();
    },
    singleList() {
      this.updateData();
    },
    once() {
      this.clickCurrent();
    },
    createType(type) {
      if (type === 'edit') this.edit();
    },
    async menuRefresher(refresh) {
      if (!refresh) return;
      await this.queryGroupSearch();
      this.clickCurrent();
    },
  },
  created() {
    this.$set(
      this.types,
      'base',
      Object.assign(this.types.base, this.menuList[0])
    );
    this.$set(
      this.types,
      'single',
      Object.assign(this.types.single, this.menuList[1])
    );
    this.common = this.menuList[2] || this.common;
  },
  mounted() {
    this.title = this.target.name;
    this.current = JSON.parse(localStorage.getItem('json_menu_current'));
    this.$store.commit('jsonFormStore/setMenu', this.current);
    this.queryGroupSearch();
  },
  methods: {
    clickCurrent() {
      const {
        params: { id },
      } = this.$route;
      this.id = id;
      const item = this.$store.state.jsonFormStore.allData.filter(
        (item) => item.id === id
      )[0];
      if (!item) return this.clickList();
      const type = item.type;
      this.clickList(item, type, this.types[type]);
    },
    async queryGroupSearch() {
      const { data } = await this.$apollo.query({
        query: FormGroups,
        variables: this.variables,
        fetchPolicy: 'no-cache',
      });
      console.log('---------dasdasdas----', data);
      const list = data['FormGroups'].data;
      const base = [];
      const common = {};
      const single = [];
      list.forEach((item) => {
        if (item.type === 'base') {
          base.push({
            id: item.id,
            code: item.code,
            config: item.config,
            name: item.name,
            created_at: item.created_at,
          });
        } else if (item.type === 'common') {
          const { category, config } = item;
          if (!common[category]) {
            common[category] = {
              label: category,
              config,
              children: [
                {
                  name: item.name,
                  id: item.id,
                  code: item.code,
                },
              ],
              collpase: true,
            };
          } else {
            common[category].children.push({
              name: item.name,
              id: item.id,
              code: item.code,
            });
          }
        } else {
          single.push({
            config: item.config,
            id: item.id,
            code: item.code,
            name: item.name,
          });
        }
      });
      this.$store.commit('jsonFormStore/setGroupData', {
        single,
        base,
        common,
      });
      this.$store.commit('jsonFormStore/setAllData', list);
      this.$store.commit('jsonFormStore/menuRefresher', false);
      this.handleClose();
    },
    updateData() {
      const { baseList, commonList, singleList } =
        this.$store.state.jsonFormStore;

      this.types.base = Object.assign({}, this.types.base, {
        list: baseList,
      });
      this.types.single = Object.assign({}, this.types.single, {
        list: singleList,
      });
      this.commonList = commonList;
      this.once = true;
      this.tempList = Object.keys(commonList).map((key) => {
        return {
          label: key,
          value: key,
        };
      });
    },
    handleCreate(val) {
      this.tempList.push({
        value: val,
        label: val,
        collpase: true,
      });
    },
    collpaseHandler(block) {
      this.$set(block, 'collpase', !block.collpase);
    },
    clickList(item = {}, title, block = {}) {
      this.$store.commit('jsonFormStore/resetPageInfo');
      this.$store.commit('jsonFormStore/setCategory', title);
      this.name = item;
      this.blockTitle = title;
      this.id = item.id;
      item.config = item.config || block.config;
      item.category = item.category || block.label;
      item.config = item.config || block.config;
      const {
        params: { id },
      } = this.$route;
      if (item.id && id !== item.id) this.$router.push(item.id);
      this.$store.commit('jsonFormStore/setCurrent', item);
      this.$store.commit('jsonFormStore/loading', true);
    },
    createHandler(title) {
      this.createShow = true;
      this.updateData();
      this.name = '';
      this.json = {
        msg: 'demo of jsoneditor',
      };
      this.$store.commit('jsonFormStore/createType', 'add');
      if (!title) {
        this.component = '';
        if (this.$refs.selectRef) this.$refs.selectRef.query = '';
        this.blockTitle = 'common';
      } else this.blockTitle = title;
    },
    handleClose() {
      this.$store.commit('jsonFormStore/createType', '');
    },
    async confirm() {
      if (this.blockTitle === 'common' && !this.component)
        return this.$Message.error('Please select a category');
      if (this.createType === 'add') await this.queryCreate();
      else await this.queryUpdate();
      this.createShow = false;
      this.$store.commit('jsonFormStore/menuRefresher', true);
    },
    edit() {
      const { name, category, config } = this.current;
      this.name = name;
      this.component = category;
      this.createShow = true;
      this.json = JSON.parse(config);
    },
    async deleteHandler() {
      await this.queryDelete();
      this.createShow = false;
      this.$store.commit('jsonFormStore/menuRefresher', true);
      const {
        path,
        params: { id },
      } = this.$route;
      const newPath = path.replace(id, 'index');
      this.$router.push(newPath);
      this.$store.commit('jsonFormStore/setCurrent', {});
    },
    async queryCreate() {
      await this.$apollo.mutate({
        mutation: FormGroupCreate,
        variables: {
          name: this.name,
          type: this.blockTitle,
          code: nanoid(),
          category: this.component,
          config: JSON.stringify(this.json),
        },
      });
      this.$Message.success('新增成功');
    },
    async queryDelete() {
      await this.$apollo.mutate({
        mutation: FormGroupRemove,
        variables: {
          id: this.id,
        },
      });
      this.$Message.success('删除成功');
    },
    async queryUpdate() {
      await this.$apollo.mutate({
        mutation: FormGroupUpdate,
        variables: {
          id: this.id,
          name: this.name,
          type: this.blockTitle,
          code: nanoid(),
          category: this.component,
          config: JSON.stringify(this.json),
        },
      });
      this.$Message.success('修改成功');
    },
    async querySearch() {
      const id = this.id;
      if (!id) return this.$store.commit('jsonFormStore/loading', false);
      const { currentPage: page = 1 } =
        this.$store.state.jsonFormStore.paginatorInfo;
      const { data } = await this.$apollo.query({
        query: FormFields,
        variables: {
          form_id: id,
          first: 50,
          page,
          order_by: '[{ field: "id", order: DESC }]',
        },
        fetchPolicy: 'no-cache',
      });
      const { data: tableData, paginatorInfo } = data['FormFields'];
      if (this.title === 'submit') await this.queryFormSubmits(tableData);
      this.$store.commit(
        `jsonFormStore/${this.$store.state.jsonFormStore.category}`,
        tableData
      );
      console.log('-----fields-----', data);
      this.$store.commit('jsonFormStore/setPaginator', paginatorInfo);
      this.$nextTick(() => this.$store.commit('jsonFormStore/loading', false));
    },
    async queryFormSubmits(_tableData) {
      const {
        paginatorInfo: { currentPage: page = 1 },
        category,
        current: { id: form_id },
      } = this.$store.state.jsonFormStore;
      const { data } = await this.$apollo.query({
        query: FormSubmits,
        variables: {
          form_id,
          first: 10,
          page,
          order_by: '[{ field: "id", order: DESC }]',
        },
        fetchPolicy: 'no-cache',
      });
      const formSubmit = data['FormSubmits'];
      this.$store.commit('jsonFormStore/setFormSubmits', formSubmit);
      console.log('form----', data);
      if (category !== 'single') return;
      const { data: singleData, id } =
        formSubmit.data.filter((item) => item.form_id === +form_id)[0] || {};
      this.$store.commit('jsonFormStore/singleId', id);
      if (!singleData) return;
      const defaultMap = JSON.parse(singleData);
      _tableData.forEach((item) => {
        const defaultValue = defaultMap[item.key];
        if (defaultValue !== undefined) {
          item.default = defaultValue;
          const schema = JSON.parse(item.schema);
          schema.default = defaultValue;
          item.schema = JSON.stringify(schema);
        }
      });
    },
  },
};
</script>

<template>
  <nav
    class="jf-menu"
    aria-label="Content-Type Builder"
    w-58
    sticky
    top-0
    h-100vh
    overflow-y-auto
    border-r-1
    border-gray-200
    z-1
  >
    <div pt6 pr4 pb2 pl6>
      <h2 class="jf-menu-title">
        {{ (target && target.content) || 'Content-Type Builder' }}
      </h2>
      <hr
        mt4
        w-5
        style="background-color: rgb(220, 220, 228)"
        h-1px
        border-none
      />
    </div>
    <div pt2 pb4>
      <ol items-stretch flex flex-col>
        <li v-for="(block, sub) in types" :key="block.content">
          <div items-stretch flex flex-col>
            <div py2 pr4 pl6>
              <div relative text-left>
                <button
                  cursor-pointer
                  border-none
                  flex
                  items-center
                  bg-transparent
                  class="menuBarTitle"
                  @click="collpaseHandler(block)"
                >
                  <span font-600 text="2.75" uppercase pr1>{{
                    block.title
                  }}</span>
                  <Icon
                    type="ios-arrow-up"
                    :class="[block.collpase ? 'rotate-x-180' : 'rotate-x-0']"
                  />
                </button>
                <div
                  translate-y="-50%"
                  absolute
                  items-center
                  inline-flex
                  justify-center
                  border-rd-1
                  right-0
                  top="50%"
                  text="2.75"
                  min-w-20px
                  font-600
                  lh="5.8"
                  style="background-color: rgb(234, 234, 239)"
                  class="menuBarTitle"
                >
                  {{ block.list.length }}
                </div>
              </div>
            </div>
            <ol v-show="block.collpase" list-none>
              <li
                v-for="item in block.list"
                :key="item.id"
                @click="clickList(item, sub, block)"
              >
                <a
                  aria-current="page"
                  flex
                  items-center
                  justify-between
                  cursor-pointer
                  py2
                  pl6
                  :class="[
                    current.id === item.id
                      ? 'active_text activeBorder'
                      : 'menuBarSubTitle',
                  ]"
                >
                  <div flex items-center class="list-item">
                    <div border-rd-full w-1 h-1 class="dot"></div>
                    <div pl2>
                      {{ item.name }}
                    </div>
                  </div>
                </a>
              </li>
            </ol>
          </div>
          <div
            v-show="target && target.name === 'groups'"
            pl8
            class="add-button"
          >
            <button
              type="button"
              cursor-pointer
              flex
              items-center
              border-none
              relative
              bg-transparent
              class="active_text"
              @click="createHandler(sub)"
            >
              <Icon type="md-add" pr1 text-3 />
              <span text-3>{{ block.content }}</span>
            </button>
          </div>
        </li>
        <li v-show="target && target.name === 'groups'">
          <div items-stretch flex flex-col>
            <div py2 pr4 pl6>
              <div pr6 relative>
                <button
                  aria-expanded="true"
                  items-center
                  flex
                  text-left
                  border-none
                  bg-transparent
                  class="menuBarTitle"
                  @click="collpase = !collpase"
                >
                  <div pr1 font-600 uppercase>
                    {{ common.title }}
                  </div>

                  <Icon
                    type="ios-arrow-up"
                    :class="[collpase ? 'rotate-x-180' : 'rotate-x-0']"
                  />
                </button>
                <div
                  translate-y="-50%"
                  bg-gray-200
                  border-rd-1
                  absolute
                  right-0
                  top="50%"
                  min-w-20px
                  items-center
                  inline-flex
                  justify-center
                  font-600
                  text="2.75"
                  uppercase
                  lh="5.8"
                  class="menuBarTitle"
                >
                  {{ Object.keys(commonList).length }}
                </div>
              </div>
            </div>
            <ol v-show="collpase" id="subnav-list-6">
              <li v-for="(block, keyName) in commonList" :key="block.value">
                <div py2 pr4 pl8 flex items-center justify-between>
                  <button
                    border-none
                    flex
                    class="menuBarSubTitle"
                    items-center
                    bg-transparent
                    @click="collpaseHandler(block)"
                  >
                    <Icon
                      type="md-arrow-dropup"
                      :class="[block.collpase ? 'rotate-x-180' : 'rotate-x-0']"
                    />
                    <div pl2>
                      {{ keyName }}
                    </div>
                  </button>
                </div>
                <ul v-show="block.collpase" id="subnav-list-7">
                  <li v-for="child in block.children" :key="child.id">
                    <a
                      flex
                      items-center
                      justify-between
                      py2
                      pl12
                      text-gray-500
                      :class="[
                        current.id === child.id
                          ? 'active_text activeBorder'
                          : 'menuBarSubTitle',
                      ]"
                      @click="clickList(child, 'common', block)"
                    >
                      <div items-center flex>
                        <div border-rd-full w-1 h-1 class="dot"></div>
                        <div pl2>
                          {{ child.name }}
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
          <div class="add-button">
            <button
              v-if="target && target.name === 'groups'"
              aria-disabled="false"
              pl8
              border-none
              cursor-pointer
              flex
              items-center
              relative
              bg-transparent
              type="button"
              class="active_text"
              @click="createHandler()"
            >
              <Icon type="md-add" pr1 text-3 />
              <span text-3>{{ common.content }}</span>
            </button>
          </div>
        </li>
      </ol>
    </div>
    <Modal
      v-model="createShow"
      :title="modalTitle"
      width="50%"
      :before-close="handleClose"
    >
      <Form grid grid-cols-2 gap-2>
        <FormItem label="显示名称">
          <Input ref="nameEl" v-model="name" placeholder="Please input Name" />
        </FormItem>
        <FormItem v-if="blockTitle === 'common'" label="选择分类">
          <Select
            ref="selectRef"
            v-model="component"
            placeholder="Select or enter a value"
            filterable
            allow-create
            clearable
            @on-create="handleCreate"
          >
            <Option
              v-for="item in tempList"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
      </Form>
      <vueJsonEditor v-model="json" mode="code"></vueJsonEditor>

      <template #footer>
        <Footer
          @cancel="createShow = false"
          @confirm="confirm"
          @delete="deleteHandler"
        />
      </template>
    </Modal>
  </nav>
</template>

<style lang="scss" scoped>
@import './style/index.scss';

::v-deep .ivu-modal-footer {
  padding: 0;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

::v-deep .ivu-select-single .ivu-select-selection {
  height: auto;
}

.jf-menu {
  .jf-icon-triangle {
    width: 8px;
    height: 8px;
  }

  .jf-icon-dot {
    width: 4px;
    height: 4px;
  }

  .jf-icon-plus {
    width: 10px;
    height: 10px;
    margin-right: 6px;
  }

  &-title {
    margin-top: 4px;
    text-align: left;
    color: $command-text-color;
    font-weight: $font-weight-bold;
    font-size: $command-font-size-title-main;
    line-height: $line-height-title-main;
  }

  ::v-deep {
    .add-button {
      line-height: 34px;
    }
  }

  .list-item {
    margin-left: 15px;
  }
}
</style>
