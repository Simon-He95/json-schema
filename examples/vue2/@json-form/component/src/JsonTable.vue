<script>
import { nanoid } from 'nanoid';
import Footer from './Footer.vue';
import JsonTabs from './JsonTabs.vue';
import SelectGroup from './SelectGroup.vue';
import vueJsonEditor from 'vue-json-editor';

import {
  FormFieldCreate,
  FormGroupCreate,
  FormFieldUpdate,
  FormFieldRemove,
  FormFields,
} from '../graphql/form.gql';
import { mapState } from 'vuex';
import ConfigModal from './configModal';
import { COMMAND_STEP_TYPE_SELECT } from './utils/constant';

const types = [
  {
    name: '文本',
    description: '文本框',
    value: 'Text',
    icon: 'carbon:string-text',
  },
  {
    name: '单选',
    description: '单选框',
    value: 'Radio',
    icon: 'carbon:radio-button-checked',
  },
  {
    name: '富文本',
    description: '富文本',
    value: 'RichText',
    icon: 'bi:file-earmark-richtext',
  },
  {
    name: '日期',
    description: '日期',
    value: 'Date',
    icon: 'bi:calendar-date',
  },
  {
    name: '下拉选',
    description: '枚举',
    value: 'Enumeration',
    icon: 'ant-design:select-outlined',
  },
  {
    name: '密码',
    description: '密码',
    value: 'Password',
    icon: 'arcticons:password',
  },
  {
    name: '数字',
    description: '数字',
    value: 'Number',
    icon: 'carbon:character-whole-number',
  },
  {
    name: '开关',
    description: '布尔',
    value: 'Boolean',
    icon: 'entypo:switch',
  },
  {
    name: '多选框',
    description: '多选框',
    value: 'Checkbox',
    icon: 'bx:checkbox-checked',
  },
  {
    name: '上传',
    description: '上传',
    value: 'Upload',
    icon: 'akar-icons:cloud-upload',
  },
  {
    name: '级联选择',
    description: '级联选择',
    value: 'Cascader',
    icon: 'clarity:tree-view-line',
  },
];
export default {
  name: 'JsonTable',
  components: {
    Footer,
    JsonTabs,
    SelectGroup,
    vueJsonEditor,
    ConfigModal,
  },
  data() {
    return {
      configModal: {
        visible: false,
        loading: false,
        step: COMMAND_STEP_TYPE_SELECT,
        data: {},
      },

      tableColumns: [
        {
          title: '标签名',
          key: 'label',
          resizable: true,
        },
        {
          title: '键名',
          key: 'key',
          resizable: true,
        },
        {
          title: '类型',
          key: 'type',
          resizable: true,
        },
        {
          title: '默认值',
          key: 'default',
          render: (h, params) => {
            const {
              type,
              groupName,
              default: defaultValue,
            } = JSON.parse(params.row.schema || null) || {};
            const value = type === 'Group' ? groupName : defaultValue;
            return h('span', value);
          },
        },
        {
          title: '创建时间',
          key: 'updated_at',
          resizable: true,
          align: 'center',
          ellipsis: true,
          render: (h, params) => h('span', params.row.updated_at.split(' ')[0]),
        },
        {
          title: '是否必填',
          key: 'required',
          resizable: true,
          align: 'center',
          render: (h, params) => {
            const { required } = JSON.parse(params.row.schema || null) || {};
            return h('span', required ? '是' : '否');
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 140,
          render: (h, params) => {
            const slot = this.$slots.default?.[0];
            return h(
              'div',
              {
                style:
                  'display:flex;align-items:center;justify-content:center;',
              },
              [
                h(
                  'div',
                  {
                    on: {
                      click: () => {
                        if (slot.data?.on?.triggerClick)
                          slot.data.on.triggerClick(params.row);
                      },
                    },
                  },
                  [slot]
                ),
                h(
                  'Button',
                  {
                    style: 'margin-left:10px;',
                    on: {
                      click: () => this.deleteHandler(params.row.id),
                    },
                  },
                  '删除'
                ),
                h(
                  'Button',
                  {
                    style: 'margin-left:10px;',
                    on: {
                      click: () => this.editHandler(params.row),
                    },
                  },
                  '编辑'
                ),
              ]
            );
          },
        },
      ],
      switchTrue: '',
      switchFalse: '',
      dragShow: false,
      dialogVisible: false,
      tableData: [],
      currentLabel: '',
      map: '',
      cardType: '',
      cardShow: true,
      type: 'add',
      input: '',
      placeholder: '',
      description: '',
      colorTitle: '',
      activeName: 'first',
      defaultvalue: '',
      datetype: '',
      format: '',
      required: false,
      minvalue: 0,
      maxvalue: 0,
      len: {
        min: undefined,
        max: undefined,
      },
      min: false,
      max: false,
      group: '',
      groupKey: '',
      multiple: false,
      controllers: [],
      buttonType: ['Radio', 'RadioButton'],
      formatOptions: [
        {
          label: '年份（四位）',
          value: 'yyyy',
        },
        {
          label: '年份（两位）',
          value: 'yy',
        },
        {
          label: '月份（两位）',
          value: 'MM',
        },
        {
          label: '月份（一位）',
          value: 'M',
        },
        {
          label: '月份（英文）',
          value: 'MMMM',
        },
        {
          label: '月份（英文简写）',
          value: 'MMM',
        },
        {
          label: '日期（两位）',
          value: 'dd',
        },
        {
          label: '日期（一位）',
          value: 'd',
        },
        {
          label: '日期（简写）',
          value: 'Do',
        },
        {
          label: '星期（两位）',
          value: 'DD',
        },
        {
          label: '星期（一位）',
          value: 'D',
        },
        {
          label: '星期（英文）',
          value: 'dddd',
        },
        {
          label: '星期（英文简写）',
          value: 'ddd',
        },
        {
          label: '小时（24小时制两位）',
          value: 'HH',
        },
        {
          label: '小时（24小时制一位）',
          value: 'H',
        },
        {
          label: '小时（12小时制两位）',
          value: 'hh',
        },
        {
          label: '小时（12小时制一位）',
          value: 'h',
        },
        {
          label: '分钟（两位）',
          value: 'mm',
        },
        {
          label: '分钟（一位）',
          value: 'm',
        },
        {
          label: '秒钟（两位）',
          value: 'ss',
        },
        {
          label: '秒钟（一位）',
          value: 's',
        },
        {
          label: '毫秒（三位）',
          value: 'SSS',
        },
        {
          label: '毫秒（两位）',
          value: 'SS',
        },
        {
          label: '毫秒（一位）',
          value: 'S',
        },
        {
          label: '上午与下午（大写）',
          value: 'A',
        },
        {
          label: '上午与下午（小写）',
          value: 'a',
        },
        {
          label: '时区',
          value: 'ZZ',
        },
      ],
      dateOptions: [
        {
          label: '时间',
          value: 'time',
        },
        {
          label: '时间区间',
          value: 'timezone',
        },
        {
          label: '日期',
          value: 'date',
        },
        {
          label: '日期区间',
          value: 'datezone',
        },
        {
          label: '日期时间',
          value: 'datetime',
        },
        {
          label: '日期时间区间',
          value: 'datetimezone',
        },
      ],
      mode: 'code',
      types,
      rules: [],
      controlTypes: ['value', 'regExp'],
      showType: ['Radio', 'RadioButton', 'Checkbox', 'CheckboxButton'],
      join: false,
      key: '',
      mapKey: '',
      options: [],
      option_label: '',
      option_value: '',
      groupOptions: [],
      buttonContent: '',
      groupValue: '',
      currentGroup: {},
      id: '',
      cascader: [],
      paginatorInfo: {
        currentPage: 1,
        total: 40,
      },
    };
  },
  computed: {
    ...mapState({
      current: (state) => state.jsonFormStore.current,
      base: (state) => state.jsonFormStore.base,
      loading: (state) => state.jsonFormStore.loading,
      single: (state) => state.jsonFormStore.single,
      common: (state) => state.jsonFormStore.common,
      FormSubmits: (state) => state.jsonFormStore.FormSubmits,
    }),
    multipleShow() {
      const multipleType = ['Enumeration'];
      return multipleType.includes(this.cardType);
    },
    jsonShow() {
      return [
        'Radio',
        'RadioButton',
        'Checkbox',
        'CheckboxButton',
        'Enumeration',
      ].includes(this.cardType);
    },
    joinShow() {
      return ['Checkbox', 'CheckboxButton', 'Enumeration'].includes(
        this.cardType
      );
    },
  },
  watch: {
    base(base) {
      this.tableData = base;
      this.paginatorInfo = this.$store.state.jsonFormStore.paginatorInfo;
    },
    single(single) {
      this.tableData = single;
      this.paginatorInfo = this.$store.state.jsonFormStore.paginatorInfo;
    },
    common(common) {
      this.tableData = common;
      this.paginatorInfo = this.$store.state.jsonFormStore.paginatorInfo;
    },
    FormSubmits(FormSubmits) {
      const { data, paginatorInfo } = FormSubmits;
      this.tableData = data;
      this.paginatorInfo = paginatorInfo;
    },
  },
  methods: {
    // 打开配置弹窗
    openConfigModal() {
      this.configModal.visible = true;
    },

    // 关闭配置弹窗
    closeConfigModal() {
      this.configModal.visible = false;
    },

    // 提交配置弹窗数据
    submitConfigModal(values) {
      this.validateFields(values)
        .then((formattedValues) => {
          this.closeConfigModal();
          this.queryFieldCreate(formattedValues);
        })
        .catch((errMsg) => {
          this.$Message.error(errMsg);
        });
    },

    // 校验表单项
    validateFields(values) {
      const illegal = this.tableData.some(
        (item) => item.id !== values.id && item.key === values.key
      );

      return illegal ? Promise.reject('键名已存在') : Promise.resolve(values);
    },

    changePage(newPage) {
      this.paginatorInfo.currentPage = newPage;
      this.$store.commit('jsonFormStore/setPaginatorInfo', {
        ...this.paginatorInfo,
      });
      this.$store.commit('jsonFormStore/loading', true);
    },
    editHandler(row) {
      this.type = 'edit';
      this.id = row.id;
      const {
        date,
        show,
        multiple,
        group,
        groupKey,
        rules,
        options,
        join,
        default: defaultvalue,
        placeholder,
        description,
        len,
        required,
        type,
        mapKey,
        cascader,
      } = JSON.parse(row.schema);
      this.mapKey = mapKey;
      if (row.type === 'Group') {
        this.cardShow = false;
        this.cardType = row.type;
        this.currentGroup = JSON.parse(row.schema);
        return (this.dialogVisible = true);
      }
      if (row.type === 'Checkbox')
        this.buttonType = ['Checkbox', 'CheckboxButton'];
      else if (row.type === 'Radio') this.buttonType = ['Radio', 'RadioButton'];
      else if (row.type === 'Date') {
        this.datetype = date.type;
        this.format = date.format;
      } else if (row.type === 'Cascader') {
        this.cascader = cascader;
      }
      this.controllers = show || [];
      this.multiple = multiple;
      this.currentLabel = this.input = row.label;
      this.key = row.key;
      this.group = group;
      this.groupKey = groupKey;
      if (rules) {
        this.rules = rules.map((item) => ({
          regExp: item.regExp,
          errMsg: item.errMsg,
        }));
      }
      this.options = options;
      this.cardShow = false;
      this.cardType = type;
      this.join = !!join;
      this.defaultvalue = defaultvalue;
      this.placeholder = placeholder;
      this.description = description;
      if (len) {
        this.len.min = len.min;
        if (this.len.min) this.min = true;
        this.len.max = len.max;
        if (this.len.max) this.max = true;
      } else
        this.len = {
          min: undefined,
          max: undefined,
        };
      this.required = required;
      this.activeName = 'first';
      this.dialogVisible = true;
      this.focusName();
    },
    async deleteHandler(id) {
      await this.queryFieldRemove(id);
    },
    getAllKeys() {
      return this.tableData.map((item) => item.keys);
    },
    confirm() {
      if (this.cardType === 'Group') return this.groupConfirm();
      if (
        this.currentLabel !== this.input &&
        this.getAllKeys().includes(this.input)
      ) {
        return this.$Message.error('该字段名已存在.');
      }
      if (!this.key) {
        return this.$Message.error('键名 是必填项');
      }
      const r = this.controllers
        .map((item) => ({
          relevancy: item.relevancy,
          controlType: item.relevancy ? item.controlType : null,
          controlReg: item.controlType === 'value' ? null : item.controlReg,
        }))
        .filter((item) => item.relevancy);

      const data = {
        id: this.id || nanoid(),
        placeholder: this.placeholder,
        description: this.description,
        label: this.input,
        type: this.cardType,
        rules: this.rules,
        default: this.defaultvalue || null,
        required: this.required,
        colorTitle: this.colorTitle,
        key: this.key || this.input,
        options: this.options,
        len: this.len,
        multiple: this.multiple,
        join: this.join,
        mapKey: this.mapKey,
        cascader: this.cascader,
        switchTrue: this.switchTrue,
        switchFalse: this.switchFalse,
      };
      if (this.cardType === 'Date') {
        data.date = {
          type: this.datetype,
          format: this.format,
        };
      }
      if (r.length) data['show'] = r;
      if (this.group) data['group'] = this.group;
      if (this.groupKey) data['groupKey'] = this.groupKey;
      if (this.type === 'add') this.queryFieldCreate(data);
      else this.queryFieldUpdate(data);
      this.dialogVisible = false;
    },
    cancel() {
      this.dialogVisible = false;
    },
    selectChange() {
      const map = {};
      for (let i = 0; i < this.controllers.length; i++) {
        const item = this.controllers[i];
        if (map[item.relevancy]) {
          this.$Message.error('相同关联字段不能重复.');
          return (item.relevancy = '');
        }
        map[item.relevancy] = true;
      }
    },
    choose(type) {
      this.cardType = type;
      this.cardShow = false;
      if (this.cardType === 'Checkbox')
        this.buttonType = ['Checkbox', 'CheckboxButton'];
      if (this.cardType === 'Radio') this.buttonType = ['Radio', 'RadioButton'];
      this.focusName();
    },
    focusName() {
      if (this.cardType === 'Group') return;
      this.$nextTick(() => {
        this.$refs.nameEl.focus();
      });
    },
    handleClose() {
      this.resetData();
    },
    add(groupShow) {
      if (groupShow) {
        this.types = [
          ...types,
          {
            name: '组',
            description: '组合',
            value: 'Group',
            icon: 'akar-icons:people-group',
          },
        ];
      } else this.types = types;
      this.resetData();
      this.dialogVisible = true;
    },
    resetData() {
      this.cardShow = true;
      this.key = '';
      this.id = '';
      this.cardType = '';
      this.description = '';
      this.groupKey = '';
      this.placeholder = '';
      this.group = '';
      this.join = false;
      this.rules = [];
      this.options = [];
      this.format = '';
      this.datetype = '';
      this.input = '';
      this.colorTitle = '';
      this.buttonContent = '';
      this.groupValue = '';
      this.defaultvalue = '';
      this.min = false;
      this.max = false;
      this.required = false;
      this.controllers = [];
      this.activeName = 'first';
      this.type = 'add';
      this.multiple = false;
      this.datetype = '';
      this.option_label = '';
      this.option_value = '';
      this.len = {
        min: undefined,
        max: undefined,
      };
      this.cascader = [];
      this.mapKey = '';
      this.switchTrue = '';
      this.switchFalse = '';
    },
    deleteReg(i) {
      this.rules.splice(i, 1);
    },
    addTag() {
      if (!this.option_label || !this.option_value)
        return this.$Message.error('新增项的数据不能为空');
      this.options.push({
        label: this.option_label,
        value: this.option_value,
      });
      this.option_label = '';
      this.option_value = '';
    },
    closeTag(i) {
      this.options.splice(i, 1);
    },
    async groupConfirm() {
      const { label, key, value, id, groupName } = this.$refs.GroupEl.save();
      const data = {
        type: 'Group',
        label,
        key,
        id,
        value,
        groupName,
      };
      if (this.type === 'add') this.queryFieldCreate(data);
      else this.queryFieldUpdate(data);
      this.dialogVisible = false;
    },
    async getGroupFIledData(form_id) {
      const { data } = await this.$apollo.query({
        query: FormFields,
        variables: {
          form_id: form_id,
          first: 50,
          page: 1,
          order_by: '[{ field: "id", order: DESC }]',
        },
        fetchPolicy: 'no-cache',
      });
      return data['FormFields'].data.map((item) => JSON.parse(item.schema));
    },
    async queryFormCreate(name, type, code, config = {}) {
      await this.$apollo.mutate({
        mutation: FormGroupCreate,
        variables: {
          name,
          type,
          code,
          config: JSON.stringify(config),
        },
      });
      this.$Message.success('创建成功');
    },
    async queryFieldCreate(data) {
      console.log('===data', data);
      await this.$apollo.mutate({
        mutation: FormFieldCreate,
        variables: {
          form_id: this.$store.state.jsonFormStore.current.id,
          label: data.label,
          key: data.key,
          type: data.type,
          schema: JSON.stringify(data),
        },
      });
      this.$Message.success('新增成功');
      this.$store.commit('jsonFormStore/loading', true);
    },
    async queryFieldUpdate(data) {
      await this.$apollo.mutate({
        mutation: FormFieldUpdate,
        variables: {
          id: this.id,
          label: data.label,
          key: data.key,
          type: data.type,
          schema: JSON.stringify(data),
        },
      });
      this.$Message.success('修改成功');
      this.$store.commit('jsonFormStore/loading', true);
    },
    async queryFieldRemove(id) {
      await this.$apollo.mutate({
        mutation: FormFieldRemove,
        variables: {
          id: id,
        },
      });
      this.$Message.success('删除成功');
      this.$store.commit('jsonFormStore/loading', true);
    },
  },
};
</script>

<template>
  <div
    id="form_wrapper"
    class="json-table"
    font-sans
    text="center gray-700 dark:gray-200"
  >
    <button @click="openConfigModal">open config modal</button>

    <!-- 配置表单信息弹窗 -->
    <config-modal
      :visible="configModal.visible"
      :loading="configModal.loading"
      :default-step="configModal.step"
      :data-source="configModal.data"
      :current-data="current"
      @close="closeConfigModal"
      @submit="submitConfigModal"
      @delete="onConfigModalDelete"
    ></config-modal>

    <Modal
      v-model="dialogVisible"
      :title="name"
      width="50%"
      :modal="false"
      :before-close="handleClose"
    >
      <div v-show="cardShow" mb6>
        <div items-center flex>
          <h2 font-600 text="4.5" lh-12>请选择一个模板类型</h2>
        </div>
        <hr bg-gray-200 h-1px border-none />
      </div>
      <JsonTabs v-show="cardShow" :types="types" @choose="choose" />
      <SelectGroup
        v-if="cardType === 'Group'"
        ref="GroupEl"
        :current-group="currentGroup"
      ></SelectGroup>
      <template v-else>
        <div v-if="cardType" relative>
          <div absolute left-0 top-0 h-10 lh-10 text-4 font-600 text-black>
            {{ type === 'add' ? '新增' : '编辑' }}{{ cardType }}项
          </div>

          <Form>
            <Tabs v-model="activeName" class="demo-tabs" px1>
              <TabPane label="基础设置" name="first">
                <div class="grid grid-cols-3 gap-2">
                  <FormItem label="标签名:">
                    <Input
                      ref="nameEl"
                      v-model="input"
                      placeholder="Please input Name"
                    />
                  </FormItem>
                  <FormItem v-show="cardType === 'Date'" label="日期类型:">
                    <Select v-model="datetype" placeholder="Pick datetype">
                      <Option
                        v-for="item in dateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </Select>
                  </FormItem>
                  <FormItem
                    v-show="cardType === 'Date'"
                    label="展示的时间格式:"
                  >
                    <Select
                      v-model="format"
                      placeholder="Pick format"
                      clearable
                    >
                      <Option
                        v-for="item in formatOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </Select>
                  </FormItem>
                  <FormItem label="占位符:">
                    <Input
                      v-model="placeholder"
                      placeholder="Please input Placeholder"
                    />
                  </FormItem>
                  <FormItem label="描述:">
                    <Input
                      v-model="description"
                      placeholder="Please input Description"
                    />
                  </FormItem>
                  <FormItem label="键名:">
                    <Input v-model="key" placeholder="Please input Key" />
                  </FormItem>
                  <FormItem label="数据映射:">
                    <Input v-model="mapKey" placeholder="Please input Key" />
                  </FormItem>
                  <template v-if="cardType === 'Boolean'">
                    <FormItem label="选中结果:">
                      <Input
                        v-model="switchTrue"
                        placeholder="Please input Key"
                      />
                    </FormItem>
                    <FormItem label="未选中结果:">
                      <Input
                        v-model="switchFalse"
                        placeholder="Please input Key"
                      />
                    </FormItem>
                  </template>
                  <FormItem v-show="showType.includes(cardType)" label="类型:">
                    <Select v-model="cardType" placeholder="Pick Size">
                      <Option
                        v-for="item in buttonType"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </Select>
                  </FormItem>
                  <FormItem v-if="multipleShow" label="是否多选:">
                    <i-switch v-model="multiple" />
                  </FormItem>
                  <FormItem
                    v-if="jsonShow"
                    label="选项"
                    style="grid-column-start: span 2"
                  >
                    <div flex="~ gap-2">
                      <Input v-model="option_label" placeholder="下拉项名" />
                      <Input v-model="option_value" placeholder="下拉项值" />
                      <Button type="info" @click="addTag">新增</Button>
                    </div>
                    <Tag
                      v-for="(item, i) in options"
                      :key="item.value"
                      :name="item.label"
                      closable
                      @on-close="closeTag(i)"
                      >{{ item.label }}/{{ item.value }}</Tag
                    >
                  </FormItem>
                  <FormItem v-if="joinShow" label="开启合并结果:">
                    <i-switch v-model="join" />
                  </FormItem>
                </div>
                <vueJsonEditor
                  v-if="cardType === 'Cascader'"
                  v-model="cascader"
                  mode="code"
                ></vueJsonEditor>
              </TabPane>
              <TabPane label="高级设置" name="second">
                <div grid gap-2 grid-cols-3>
                  <FormItem label="默认值">
                    <Input v-model="defaultvalue" />
                  </FormItem>
                  <FormItem label="是否必输">
                    <i-switch v-model="required"></i-switch>
                  </FormItem>
                </div>
                <div mb4>
                  <h3 mb2>设置</h3>
                  <div grid gap-2 grid-cols-2>
                    <div flex="~">
                      <Checkbox v-model="min" size="large">{{
                        cardType === 'Number' ? '最小值' : '最小输入长度'
                      }}</Checkbox>
                      <InputNumber
                        v-show="min"
                        v-model="len.min"
                        :min="0"
                        :max="30"
                        size="small"
                        ml-2
                        controls-position="right"
                      />
                    </div>
                    <div flex="~">
                      <Checkbox v-model="max" size="large">{{
                        cardType === 'Number' ? '最大值' : '最大输入长度'
                      }}</Checkbox>
                      <InputNumber
                        v-show="max"
                        v-model="len.max"
                        :min="0"
                        :max="30"
                        size="small"
                        ml-2
                        controls-position="right"
                      />
                    </div>
                  </div>
                </div>
                <div mb4>
                  <h3 mb2>规则校验</h3>
                  <div
                    v-for="(item, i) in rules"
                    :key="i"
                    flex="~ gap-2"
                    relative
                  >
                    <FormItem label="正则" class="w-45%">
                      <Input v-model="item.regExp" />
                    </FormItem>
                    <FormItem
                      v-show="item.regExp"
                      label="错误消息"
                      class="w-45%"
                    >
                      <Input v-model="item.errMsg" />
                    </FormItem>
                    <div absolute top-2 right-0 @click="deleteReg(i)">
                      <Icon type="md-close" size="20" />
                    </div>
                  </div>

                  <Button
                    icon="md-add"
                    @click="
                      rules.push({
                        regExp: '',
                        errMsg: '',
                      })
                    "
                    >新增规则</Button
                  >
                </div>
                <div>
                  <h3 mb2>显隐关联</h3>
                  <div v-for="(item, idx) in controllers" :key="idx" relative>
                    <div
                      absolute
                      right-0
                      top-2
                      @click="controllers.splice(idx, 1)"
                    >
                      <Icon type="md-close" />
                    </div>
                    <div grid grid-cols-3 gap-2>
                      <FormItem label="选择关联字段">
                        <Select
                          v-model="item.relevancy"
                          placeholder="Select"
                          clearable
                          @change="selectChange"
                        >
                          <Option
                            v-for="i in tableData.filter(
                              (item) => !item.group && item.label !== input
                            )"
                            :key="i.name"
                            :label="i.key"
                            :value="i.key"
                          />
                        </Select>
                      </FormItem>
                      <FormItem v-show="item.relevancy" label="选择规则">
                        <Select v-model="item.controlType" placeholder="Select">
                          <Option
                            v-for="i in controlTypes"
                            :key="i"
                            :label="i"
                            :value="i"
                          />
                        </Select>
                      </FormItem>
                      <FormItem
                        v-show="item.controlType === 'regExp'"
                        label="正则"
                      >
                        <Input v-model="item.controlReg" input-style="h-full" />
                      </FormItem>
                    </div>
                  </div>
                  <Button
                    icon="md-add"
                    @click="
                      controllers.push({
                        relevancy: '',
                        controlType: '',
                        controlReg: '',
                      })
                    "
                  >
                    新增关联
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </template>
      <template #footer>
        <Footer @cancel="cancel" @confirm="confirm" />
      </template>
    </Modal>
    <Table :loading="loading" :data="tableData" :columns="tableColumns" w-full>
    </Table>
    <Page
      text-center
      mt-8
      :total="paginatorInfo.total"
      :current.sync="paginatorInfo.currentPage"
      size="small"
      show-total
      @on-change="changePage"
    />
  </div>
</template>

<style scoped>
/deep/ .ivu-modal-footer {
  padding: 0;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.demo-tabs /deep/ .ivu-tabs-nav {
  float: right !important;
}

.demo-tabs /deep/ .ivu-form-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.demo-tabs /deep/ .ivu-form-item .ivu-form-item-content {
  width: 100%;
}

.demo-tabs /deep/ .ivu-tabs-nav .ivu-tabs-tab {
  font-size: 12px;
  padding: 16px;
}

.demo-tabs /deep/ .ivu-checkbox-wrapper.ivu-checkbox-large {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.demo-tabs /deep/ .ivu-checkbox-wrapper.ivu-checkbox-large .ivu-checkbox {
  padding-right: 8px;
}
</style>

<style lang="scss" scoped>
@import './style/variables';

::v-deep {
  .ivu-table {
    font-size: 12px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: $black-001;

    .ivu-table-header {
      color: $blue-002;
    }
  }

  button span {
    font-size: 12px;
  }
}
</style>
