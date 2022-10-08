<script>
import Manage from './Manage';
import single from './single.vue';
import {
  FormSubmitCreate,
  FormSubmitUpdate,
  FormFields,
} from '../graphql/form.gql';
import { mapState } from 'vuex';
import { getNonceStr } from './utils/utils';

export default {
  name: 'App',
  components: {
    Manage,
    single,
  },
  data() {
    return {
      result: localStorage.getItem('json_form_list')
        ? JSON.parse(localStorage.getItem('json_form_list'))
        : {},
      title: 'Content',
      groups: [],
      tableData: [],
      target: {},
      status: 'add',
      id: '',
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.jsonFormStore.loading,
      paginatorInfo: (state) => state.jsonFormStore.paginatorInfo,
      category: (state) => state.jsonFormStore.category,
      current: (state) => state.jsonFormStore.current,
      formSubmit: (state) => state.jsonFormStore.formSubmit,
      single: (state) => state.jsonFormStore.single,
      singleId: (state) => state.jsonFormStore.singleId,
    }),
  },
  watch: {
    async single(single) {
      const tableData = [];
      for (const item of single) {
        const schema = JSON.parse(item.schema);
        if (item.type === 'Group')
          tableData.push(
            Object.assign(schema, {
              group: await this.queryCommonFields(schema.value),
            })
          );
        else tableData.push(schema);
      }

      this.tableData = await Promise.all(tableData);
    },
  },
  methods: {
    publish(jsonFormEl) {
      const mapJSON = jsonFormEl.getMapJSON();
      console.log('------', mapJSON, '--------');
    },
    async queryCommonFields(form_id) {
      const { data } = await this.$apollo.query({
        query: FormFields,
        variables: {
          form_id,
          first: 50,
          page: 1,
          order_by: '[{ field: "id", order: DESC }]',
        },
        fetchPolicy: 'no-cache',
      });
      console.log('-----', data);
      return data['FormFields'].data.map((item) => JSON.parse(item.schema));
    },
    updateGroup() {
      const componentList = this.$refs.menuEl.componentList;
      const _groups = [];
      for (const key in componentList) {
        const item = componentList[key];
        item.children.forEach((child) => {
          _groups.push({
            label: item.label + ' - ' + child.name,
            value: item.label + '-' + child.name,
          });
        });
      }
      this.groups = _groups;
    },
    add() {
      this.$refs.formEl.add(this.category !== 'component');
    },
    async saveSingle(formRef) {
      const { data, template_map } = this.$refs.jsonFormEl.getFinalData(formRef);
      if (!this.singleId) this.querySubmitCreate(data, template_map);
      else this.querySubmitUpdate(data, template_map);
    },
    async querySubmitCreate(data, template_map) {
      await this.$apollo.mutate({
        mutation: FormSubmitCreate,
        variables: {
          form_id: this.$store.state.jsonFormStore.current.id,
          data: JSON.stringify(data),
          template_map: template_map ? JSON.stringify(template_map) : null,
          nonce_str: getNonceStr(),
        },
      });
      this.$Message.success('新增成功');
    },
    async querySubmitUpdate(data, template_map) {
      await this.$apollo.mutate({
        mutation: FormSubmitUpdate,
        variables: {
          id: this.singleId,
          data: JSON.stringify(data),
          template_map: template_map ? JSON.stringify(template_map) : null,
          nonce_str: getNonceStr(),
        },
      });
      this.$Message.success('修改成功');
    },
  },
};
</script>

<template>
  <div px14 pt6 pb10 class="jf-form">
    <single v-if="category === 'single'" :table-data="tableData">
      <template #default="props">
        <!-- <Button icon="md-checkmark" @click="publish(props.formRef)"
          >Unpublish</Button
        > -->
        <Button ml3 @click="saveSingle(props.formRef)">保存</Button>
      </template>
    </single>
    <Manage v-show="category === 'base' && current.name" ref="jsonFormEl">
      <slot />
    </Manage>
  </div>
</template>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
