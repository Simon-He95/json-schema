<template>
  <div class="batch-query-select">
    <div class="batch-query-select-select">
      <ButtonGroup class="batch-query-select-select-tabs">
        <Button
          v-for="(label, field) in options"
          :key="field"
          @click="(e) => onSelectOption(e, field, label)"
          >{{ label }}</Button
        >
      </ButtonGroup>

      <slot></slot>

      <div class="batch-query-select-select-ops">
        <silent-button
          @click="onCloseTextarea"
          v-if="search.visible || add.visible"
          >返 回</silent-button
        >
        <silent-button type="primary" @click="onSearch" v-if="!add.visible"
          >查 询</silent-button
        >
        <silent-button type="primary" @click="onAdd" v-if="addBtnVisible"
          >手动添加</silent-button
        >
        <silent-button type="primary" @click="onAddConfirm" v-if="add.visible"
          >确认添加</silent-button
        >
      </div>
    </div>

    <!-- 查询输入框 -->
    <div
      class="batch-query-select-textarea batch-query-select-textarea-search"
      v-show="search.visible"
    >
      <span
        class="triangle"
        :style="{ transform: `translateX(${triangleLeft}px)` }"
      ></span>
      <div class="inner-wrap">
        <Input
          v-model="search.value"
          type="textarea"
          :placeholder="search.placeholder"
          :rows="mergedStyleConfig.rows"
        />
      </div>
    </div>

    <!-- 手动添加输入框 -->
    <div
      class="batch-query-select-textarea batch-query-select-textarea-add"
      v-show="add.visible"
    >
      <span class="triangle"></span>
      <div class="inner-wrap">
        <Input
          v-model="add.value"
          type="textarea"
          :placeholder="`请输入${this.primaryKey}`"
          :rows="mergedStyleConfig.rows"
        />
      </div>
    </div>

    <Table
      v-show="tableVisivle"
      :columns="columns"
      :data="tableData"
      :loading="search.loading"
      :width="mergedStyleConfig.width"
      class="batch-query-select-values"
    >
      <template v-for="item in slotColumns" v-slot:[item]="{ row, index }">
        <slot :name="item" :row="row" :index="index"></slot>
      </template>
      <template #action="{ row }">
        <div class="delete-btn" @click="onDelete(row)">删除</div>
      </template>
    </Table>
  </div>
</template>

<script>
/**
 * 批量搜索表单组件
 * @param {Array} columns 搜索结果值表格所用columns，格式同Table组件columns属性
 * @param {Object} options 渲染顶部tab所需的键值对组成的对象，键名为值field用于搜索、键值为label用于展示
 * @param {StyleConfig} styleConfig 组件样式配置项
 * @param {Array} value 表单项值
 * @param {String} primaryKey 表单值在tableData中对应的字段名，用于最终提取表单值以及回显时提交搜索，默认值'id'
 * @param {Boolean} manullyable 是否可手动添加
 * @param {Array} defaultValue 表单默认值，用于回显（若使用value，则无法区分回显与正常value变更情况）
 * @param {Function} searchHandler 用于执行搜索操作的函数，需返回调用接口的Promise对象，并在then中返回搜索出的array数据
 * @param {Function} resultHandler 提供给外界使用的表格填充前的钩子函数，用于处理表格数据，需返回处理后的数据array
 * 
 * @type {Object} StyleConfig
 *  {
 *    rows: 10,    // textatra行数
      width: 624,  // 表格宽度
 *  }
 */
import { isFunction, isPromise, isArray } from '../../utils/type';
import { ComponentError } from '../../utils/error';
import { getString } from '../../utils/utils';

export default {
  name: 'SilentBatchQuerySelect',
  props: {
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    styleConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    primaryKey: {
      type: String,
      default: 'id',
    },
    manullyable: {
      type: Boolean,
      default: true,
    },
    defaultValue: Array, // 回显列表时使用
    searchHandler: Function, // return Promise
    resultHandler: Function, // return Array
  },

  data() {
    return {
      active: '',
      search: {
        type: '',
        visible: false,
        loading: false,
        value: '',
        placeholder: '',
      },
      add: {
        visible: false,
        value: '',
      },
      tableData: [],
      triangleLeft: 0,
    };
  },

  watch: {
    defaultValue(val) {
      this.echoTable(val);
    },

    tableData: {
      deep: true,
      handler(values) {
        const result = values.map((item) => getString(item[this.primaryKey]));
        this.$emit('input', result);
      },
    },

    'search.visible': {
      deep: true,
      handler(val) {
        if (val) {
          this.add.visible = false;
        }
      },
    },
  },

  computed: {
    mergedStyleConfig() {
      const defaultStyleConfig = {
        rows: 10,
        width: 624,
      };
      return Object.assign(defaultStyleConfig, this.styleConfig);
    },

    slotColumns() {
      return this.columns.filter((item) => item.slot).map((item) => item.slot);
    },

    addBtnVisible() {
      return this.manullyable && !this.search.visible && !this.add.visible;
    },

    tableVisivle() {
      return !(this.search.visible || this.add.visible);
    },
  },

  methods: {
    // 切换类型
    onSelectOption(e, record, label) {
      const targetEl = e.target;
      this.active = record;
      this.search.visible = true;
      this.search.placeholder = label;
      this.triangleLeft =
        targetEl.offsetLeft + Math.floor(targetEl.clientWidth / 2) - 8;
    },

    // 关闭输入框
    onCloseTextarea() {
      this.add.visible = false;
      this.search.visible = false;
    },

    // 搜索
    onSearch() {
      const values = this.getValues(this.search.value);
      this.searchResult(values, this.active);
    },

    searchResult(params, key, isEcho) {
      if (isFunction(this.searchHandler)) {
        const searchRes = this.searchHandler({
          [key]: params,
        });

        this.onCloseTextarea();

        // searchHandler需返回Promise
        if (process.env.NODE_ENV === 'development') {
          if (!isPromise(searchRes)) {
            return new ComponentError(
              'BatchQuerySelect',
              'searchHandler needs return a Promise'
            ).showError();
          }
        }

        this.search.loading = true;

        searchRes
          .then((res) => {
            this.search.value = '';
            this.setTableData(res, isEcho);
          })
          .catch(() => {
            this.setTableData([], isEcho);
          })
          .finally(() => {
            this.search.loading = false;
          });
      }
    },

    echoTable(values = []) {
      if (values && values.length) {
        this.searchResult(values, this.primaryKey, true);
        return;
      }
      this.tableData = [];
    },

    // 设置表格数据
    setTableData(data = [], isEcho) {
      let result = this.tableData.concat(data);
      console.log('===setTableData', data);
      // 过滤数据
      const [dataMap, filteredResult] = this.filterData(result);
      result = filteredResult;

      // 回显时添加未查询出的数据到列表
      if (isEcho) {
        result = this.compeleteTableData(result, dataMap);
      }

      if (isFunction(this.resultHandler)) {
        result = this.resultHandler(result);

        if (process.env.NODE_ENV === 'development') {
          if (!isArray(result)) {
            return new ComponentError(
              'BatchQuerySelect',
              'resultHandler needs return a Array'
            ).showError();
          }
        }
      }

      this.tableData = result;
    },

    // 回显时，若搜索不到相应数据则填充空值
    compeleteTableData(data = [], dataMap = {}) {
      const finalData = data.concat([]);
      const defaultValue = this.defaultValue || [];

      defaultValue.forEach((item) => {
        if (!dataMap[item]) {
          finalData.push({ [this.primaryKey]: item });
        }
      });

      return finalData;
    },

    // 过滤数据
    filterData(data = []) {
      const dataMap = {};
      const finalData = [];

      // 根据primaryKey去重
      data.forEach((item) => {
        const primaryVal = item[this.primaryKey];

        if (dataMap[primaryVal]) return;

        dataMap[primaryVal] = 1;
        finalData.push(item);
      });

      return [dataMap, finalData];
    },

    // 删除
    onDelete(record) {
      this.tableData = this.tableData.filter(
        (item) => item[this.primaryKey] !== record[this.primaryKey]
      );
    },

    getValues(value = '') {
      return value.split('\n').filter((item) => item);
    },

    onAdd() {
      this.add.visible = true;
    },

    onAddConfirm() {
      const addVal = this.add.value || '';
      const values = addVal.split('\n').map((item) => {
        return {
          [this.primaryKey]: item,
        };
      });
      this.add.value = '';
      this.add.visible = false;
      this.setTableData(values);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/index.scss';
.batch-query-select {
  width: 100%;

  &-select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    &-ops {
      flex-shrink: 0;
      ::v-deep .ivu-btn {
        height: 30px;
        margin-left: 8px;
      }
    }

    &-tabs {
      flex-shrink: 0;
      margin-right: 8px;
      
      ::v-deep {
        .ivu-btn {
          height: 34px;
          font-size: $font-size-text;
          font-weight: $font-weight-normal;

          & > i,
          & > span {
            pointer-events: none;
          }
        }
      }
    }
  }
  &-textarea {
    position: relative;
    padding-top: 8px;

    .inner-wrap {
      border: 1px solid $command-border-color;
      border-radius: $border-radius-md;

      ::v-deep {
        .ivu-input {
          padding: 8px;
          border: none;
        }
      }
    }

    &-search {
      .triangle {
        left: 0;
        transition: transform $transition-easeinout-001;
      }
    }

    &-add {
      .triangle {
        left: auto;
        right: 32px;
      }
    }
  }

  &-values {
    margin-top: 16px;
  }

  .delete-btn {
    color: $command-danger-color;
    cursor: pointer;
  }
}
</style>
