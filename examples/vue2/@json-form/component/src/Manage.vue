<template>
  <div id="jsonTable" class="jf-table-wrap" flex box-border w-full>
    <div
      v-show="!dialogTableVisible"
      class="jf-table-inner"
      text-left
      flex-auto
    >
      <Header
        class="jf-table-header"
        :title="current.name"
        :description="message"
      >
        <template #opts>
          <Button type="primary" @click="createForm">
            <Icon type="ios-paper-plane" />发送
          </Button>
        </template>
      </Header>

      <div v-show="deleteShow">
        <div>
          <div pb-4 items-center flex justify-between>
            <div items-center flex>
              <span text-4>1 entry selected</span>
              <button
                style="
                  border: 1px solid rgb(245, 192, 184);
                  background: rgb(252, 236, 234);
                  color: rgb(183, 43, 26);
                "
                flex
                cursor-pointer
                border-rd-2
                px4
                py3
                ml2
                items-center
                @click="deleteAll"
              >
                <Icon type="ios-trash" text-5 pr2 />
                <span font-600 text="3.5">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- <Table
        :loading="loading"
        :data="tableData"
        :columns="tableColumns"
        @on-selection-change="selectAll"
      />
      <Page
        text-center
        mt-8
        :total="paginatorInfo.total"
        :current.sync="paginatorInfo.currentPage"
        size="small"
        show-total
      /> -->

      <!-- 提交记录表格 -->
      <JFTable
        class="command-sender-table"
        :columns="recordsColumns"
        :loading="loading"
        :data-source="tableData"
        :showSizer="false"
        :pagination="paginatorInfo"
        @cell-click="handleCellClick"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #id="{ row }">
          {{ row.id }}
        </template>
        <template #template_map>查看</template>
        <template #notice_res>查看</template>

        <!-- <template #checked_at="{ row }">
          {{ formatDateLabel(row.checked_at) }}
        </template> -->
        <template #created_at="{ row }">
          {{ formatDateLabel(row.created_at) }}
        </template>
      </JFTable>
    </div>

    <!-- 表单填写弹窗 -->
    <single
      v-show="dialogTableVisible"
      :table-data="json"
      @back="dialogTableVisible = false"
    >
      <template #default="props">
        <Button @click="dialogTableVisible = false">
          关闭
        </Button>
        <Button ml3 type="primary" @click="saveForm(props.formRef)">保存</Button>
      </template>
    </single>

    <!-- 查看详情弹窗 -->
    <DetailModal
      :visible="detailModal.visible"
      :data-source="detailModal.record"
      @close="closeDetailModal"
    />
  </div>
</template>

<script>
import single from './single';
import {
  FormSubmitCreate,
  FormSubmitRemove,
  FormSubmitUpdate,
  FormFields,
} from '../graphql/form.gql';
import { mapState } from 'vuex';
import { deepMerge } from '@json-form/util';

import { JFTable } from './component';
import Header from './modules/header';
import DetailModal from './modules/submit/detailModal.vue';
import { isArray } from './utils/type';
import { getJSON, getNonceStr } from './utils/utils';
import {
  BASIC_COMP_DATE,
  BASIC_COMP_GROUP,
  DATE_FMT_TIMESTAMP,
  DATE_FMT_UNIXTIMESTAMP,
  isTimeType,
  recordsColumns,
} from './utils/options';
import {
  encodeTimestamp,
  encodeUnixTimestamp,
  decodeMilliTime,
  decodeTime,
  formatDateLabel,
} from './utils/date';

export default {
  name: 'Manage',
  components: {
    Header,
    single,
    JFTable,
    DetailModal,
  },
  data() {
    this.recordsColumns = recordsColumns;
    return {
      tableData: [],
      paginatorInfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      detailModal: {
        visible: false,
        record: {},
      },
      // TBD
      json: [],
      // tableColumns: [
      //   {
      //     type: 'selection',
      //     width: 60,
      //     align: 'center',
      //   },
      //   {
      //     title: 'id',
      //     key: 'id',
      //     width: 80,
      //   },
      //   {
      //     title: '状态',
      //     align: 'center',
      //     key: 'status',
      //   },
      //   {
      //     title: '更新时间',
      //     key: 'updated_at',
      //     render: (h, params) => h('span', params.row.updated_at.split(' ')[0]),
      //   },
      //   {
      //     title: '操作',
      //     align: 'center',
      //     fixed: 'right',
      //     minWidth: 140,
      //     render: (h, params) => {
      //       const slot = this.$slots.default?.[0];
      //       return h(
      //         'div',
      //         {
      //           style: 'display:flex;align-items:center;justify-content:center',
      //         },
      //         [
      //           h(
      //             'div',
      //             {
      //               on: {
      //                 click: () => {
      //                   if (slot.data?.on?.triggerClick)
      //                     slot.data.on.triggerClick(params.row);
      //                 },
      //               },
      //             },
      //             [slot]
      //           ),
      //           h(
      //             'Button',
      //             {
      //               style: 'margin-left:10px;',
      //               on: {
      //                 click: () => this.editRow(params.row, params.index),
      //               },
      //             },
      //             'edit'
      //           ),
      //           h(
      //             'Button',
      //             {
      //               style: 'margin-left:10px;',
      //               on: {
      //                 click: () => this.copyRow(params.row),
      //               },
      //             },
      //             'copy'
      //           ),
      //           h(
      //             'Button',
      //             {
      //               style: 'margin-left:10px;',
      //               on: {
      //                 click: () => this.queryRemove(params.row.id),
      //               },
      //             },
      //             'delete'
      //           ),
      //         ]
      //       );
      //     },
      //   },
      // ],
      name: '',
      deleteShow: false,
      dialogTableVisible: false,
      type: 'add',
      deleteItems: [],
      id: '',
    };
  },
  computed: {
    message() {
      const tableData = this.tableData || [];
      return `请在此处管理表单提交记录，一共有${tableData.length}项`;
    },
    ...mapState({
      current: (state) => state.jsonFormStore.current,
      loading: (state) => state.jsonFormStore.loading,
      FormSubmits: (state) => state.jsonFormStore.FormSubmits,
    }),
  },
  watch: {
    FormSubmits() {
      this.querySearch();
      this.dialogTableVisible = false;
    },
  },
  methods: {
    // 格式化时间
    formatDateLabel,

    // 表格页码改变
    onPageChange(page) {
      this.paginatorInfo.currentPage = page;
      this.$store.commit('jsonFormStore/setPaginator', {
        currentPage: page,
      });
      this.$store.commit('jsonFormStore/loading', true);
    },

    // 表格每页数量改变
    onPageSizeChange(pageSize) {
      this.paginatorInfo.pageSize = pageSize;
    },

    // 表格单元格被点击
    handleCellClick(record, colKey, e, index) {
      switch (colKey) {
        case 'template_map':
        case 'notice_res':
          this.openDetailModal(record[colKey]);
          break;
        case 'id':
          this.editRow(record, index);
          break;
        default:
      }
    },

    // 打开“发送数据”弹窗
    openDetailModal(record = {}) {
      this.detailModal.visible = true;
      this.detailModal.record = getJSON(record);
    },

    // 关闭“发送数据”弹窗
    closeDetailModal() {
      this.detailModal.visible = false;
      this.detailModal.record = {};
    },

    // 处理时间与时间范围的解密
    handleTimeDecode(target, handler) {
      if (isArray(target)) {
        return target.map((item) => handler(item));
      }
      return handler(target);
    },

    // 格式化最终值
    formattedData(data = {}, schema = {}) {
      const result = {};
      console.log('==formattedData', data, schema)
      Object.entries(schema).forEach(([field, item]) => {
        switch (item.type) {
          // 格式化日期
          case BASIC_COMP_DATE:
            const { date } = item;
            if (date && date.formattor) {
              // 时间
              if (isTimeType(date.type)) {
                switch (date.formattor) {
                  // 毫秒时间戳
                  case DATE_FMT_TIMESTAMP:
                    return (result[field] = this.handleTimeDecode(
                      data[field],
                      decodeMilliTime
                    ));
                  // 秒级时间戳
                  case DATE_FMT_UNIXTIMESTAMP:
                    return (result[field] = this.handleTimeDecode(
                      data[field],
                      decodeTime
                    ));
                  default:
                }
              } else {
                // 日期
                switch (date.formattor) {
                  // 毫秒时间戳
                  case DATE_FMT_TIMESTAMP:
                    return (result[field] = this.handleTimeDecode(
                      data[field],
                      encodeTimestamp
                    ));
                  // 秒级时间戳
                  case DATE_FMT_UNIXTIMESTAMP:
                    return (result[field] = this.handleTimeDecode(
                      data[field],
                      encodeUnixTimestamp
                    ));
                  default:
                }
              }
            }
            result[field] = data[field];
            break;

          case BASIC_COMP_GROUP:
            const groupSchema = {};
            item.group.forEach((groupItem) => {
              groupSchema[groupItem.key] = groupItem;
            });
            result[field] = data[field].map((dataItem) => {
              return this.formattedData(dataItem, groupSchema);
            });
            break;

          default:
            result[field] = data[field];
        }
      });
      console.log('==result', result);
      return result;
    },

    // 获取最终值
    getFinalData(formEl) {
      const data = formEl.getFormData();
      const { template } = JSON.parse(
        (this.$store.state.jsonFormStore.current || {}).config
      );
      let template_map;
      if (template) {
        const formFields = formEl.getFormSchema();
        const formmaterData = this.formattedData(
          data,
          formFields && formFields.attribs
        );
        const mapData = formEl.getMapJSON(formmaterData);
        console.log('-----mapJSON---- start');
        console.log(mapData);
        console.log('-----mapJSON---- end');
        template_map = deepMerge(template, mapData);
        console.log('----tempmap----');
        console.log(template_map);
        console.log('----tempmap----');
      }
      return { data, template_map };
    },

    // 提交表单数据
    async saveForm(formEl) {
      if (!(await formEl.validate()))
        return this.$Message.error('请填写必输项');

      const { data, template_map } = this.getFinalData(formEl);

      if (this.type === 'add') this.queryCreate(data, template_map);
      else this.queryUpdate(data, template_map);
      this.dialogTableVisible = false;
    },
    mapTemplate(template, mapData) {
      return Object.keys(template).reduce((result, key) => {
        const val = mapData[key];
        if (val) result[key] = val;
        return result;
      }, {});
    },

    async getJson() {
      this.json = await Promise.all(
        this.$store.state.jsonFormStore.base.map(async (item) => {
          const schema = JSON.parse(item.schema);
          if (schema.type !== 'Group') return schema;
          const { value } = schema;
          const group = await this.getGroup(value);
          console.log('group', group);
          return Object.assign(schema, { group });
        })
      );
    },
    async getGroup(id) {
      const { data } = await this.$apollo.query({
        query: FormFields,
        variables: {
          form_id: id,
          first: 50,
          page: 1,
          order_by: '[{ field: "id", order: DESC }]',
        },
        fetchPolicy: 'no-cache',
      });
      const { data: tableData } = data['FormFields'];
      return tableData.map((item) => JSON.parse(item.schema));
    },
    deleteAll() {
      this.queryRemove(this.deleteItems);
      this.deleteShow = false;
    },
    editRow(row, i) {
      this.setJson(row, i);
      this.type = 'edit';
    },
    copyRow(row) {
      this.setJson(row);
      this.type = 'add';
    },
    async setJson(row) {
      this.id = row.id;
      await this.getJson();
      const data = JSON.parse(row.data);
      this.json = this.json.map((json) => {
        const key = json.key;
        if (data[key] !== undefined) json.default = data[key];
        return json;
      });
      console.log(this.json);
      this.dialogTableVisible = true;
    },
    switchForm(key) {
      this.name = key;
    },
    copyData(data) {
      return JSON.parse(JSON.stringify(data));
    },
    selectAll(selection) {
      this.deleteShow = selection.length;
      this.deleteItems = selection.map((item) => item.id);
    },
    async createForm() {
      await this.getJson();
      if (!this.json) return this.$Message.error('当前还没有可用的模板');
      this.type = 'add';
      this.dialogTableVisible = true;
    },
    async queryCreate(data, template_map) {
      await this.$apollo.mutate({
        mutation: FormSubmitCreate,
        variables: {
          form_id: this.$store.state.jsonFormStore.current.id,
          data: JSON.stringify(data),
          template_map: template_map ? JSON.stringify(template_map) : null,
          nonce_str: getNonceStr(),
        },
      });
      this.$Message.success('创建成功');
      this.$store.commit('jsonFormStore/loading', true);
    },
    async queryUpdate(data, template_map) {
      await this.$apollo.mutate({
        mutation: FormSubmitUpdate,
        variables: {
          id: this.id,
          data: JSON.stringify(data),
          template_map: template_map ? JSON.stringify(template_map) : null,
          nonce_str: getNonceStr(),
        },
      });
      this.$Message.success('修改成功');
      this.$store.commit('jsonFormStore/loading', true);
    },
    querySearch() {
      const { data, paginatorInfo } =
        this.$store.state.jsonFormStore.FormSubmits;
      this.tableData = data;
      this.paginatorInfo = paginatorInfo;
    },
    async queryRemove(id) {
      await this.$apollo.mutate({
        mutation: FormSubmitRemove,
        variables: {
          id,
        },
      });
      this.$Message.success('删除成功');
      this.$store.commit('jsonFormStore/loading', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer {
  ::v-deep {
    .ivu-drawer-body {
      overflow: hidden;
    }
  }
}

.jf-table-inner {
  display: flex;
  flex-direction: column;
}
.jf-table-header {
  flex-shrink: 0;
}
</style>
