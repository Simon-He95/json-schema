<template>
  <div class="s-searchable-select">
    <!-- 值选择 -->
    <div
      :class="[
        's-searchable-select-select',
        visible ? 's-searchable-select-select-active' : '',
      ]"
    >
      <div class="s-searchable-select-select-selector" @click="onSelectOpen">
        <div class="s-searchable-select-select-mask"></div>
        <Input
          v-model="selected.label"
          class="s-searchable-select-select-input"
          :placeholder="primaryPlaceholder"
        />
        <Icon class="s-searchable-select-select-icon" type="ios-arrow-down" />
      </div>
      <Input
        v-for="(item, field) in fields"
        v-model="form[field]"
        class="s-searchable-select-select-countor"
        :key="field"
        :type="item.type"
        :placeholder="item.placeholder"
      />

      <div class="s-searchable-select-select-ops">
        <silent-button @click="onSelectCancel" v-if="visible"
          >返 回</silent-button
        >
        <silent-button class="create-button" type="primary" @click="onAdd"
          >新 增</silent-button
        >
      </div>
    </div>

    <!-- 值列表 -->
    <div class="s-searchable-select-list-wrap" v-show="visible">
      <div class="s-searchable-select-list">
        <span class="triangle"></span>
        <div class="inner-wrap">
          <!-- 左侧选择 -->
          <ul class="left-wrap">
            <li
              v-for="(label, value) in tabs"
              :key="value"
              :class="[
                'tab-item',
                activeTab === value ? 'tab-item-active' : '',
              ]"
              @click="onTabActive({ label, value })"
            >
              {{ label }}
            </li>
          </ul>
          <!-- 右侧表格 -->
          <div class="right-wrap">
            <div class="name-search">
              <Input
                class="search-input"
                :placeholder="searchPlaceholder"
                search
                v-model="query"
                @on-search="onSearch"
              />
            </div>
            <RadioGroup v-model="checkedValue">
              <Table
                :width="tableWidth"
                :columns="tableColumn"
                :data="tableData"
                :loading="loading"
              >
                <template #selector="{ row }">
                  <div class="table-radio">
                    <Radio
                      :label="row[primaryField]"
                      :key="row[primaryField]"
                    ></Radio>
                  </div>
                </template>
              </Table>
              <Page
                class="s-searchable-select-pagination"
                :modelValue="pagination.currentPage"
                :total="pagination.total"
                :page-size="pagination.pageSize"
                @on-change="onPageChange"
              />
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>

    <!-- 值保存处 -->
    <div class="s-searchable-select-variables" v-show="!visible">
      <Tag
        v-for="val in values"
        :key="val._key"
        closable
        @on-close="onDelete(val)"
        >{{ val._label }}</Tag
      >
    </div>
  </div>
</template>

<script>
import { getJSONString } from '@/utils/utils';
import { ComponentError } from '@/utils/error';
import { LABEL_DIVIDER } from '@/utils/constant';
import { isFunction, isPromise } from '@/utils/type';

let itemIndex = 0;
const VALUE_DIVIDER = ' * ';
const MAX_PAGESIZE = 100; // 接口定义最大值100，因此使用100

export default {
  name: 'SilentSearchableSelect',
  props: {
    tabField: String, // 搜索区左侧tab栏的字段名
    primaryField: String, // 用于从列表数据中提取所需值的字段
    primaryNameField: String, // 用于展示所选值名称所需的字段
    primaryPlaceholder: String, // 搜索下拉表单项的占位提示语
    searchPlaceholder: String, // 搜索区搜索框的占位提示语
    tableWidth: Number,
    tabs: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fields: {
      type: Object,
      default: () => {
        return {};
      },
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
    searchHandler: Function, // 搜索函数，返回值为Promise，Promise的then中回调函数的参数为data、total组成的对象
  },

  data() {
    return {
      query: '',
      visible: false,
      loading: false,
      activeTab: '',
      checkedValue: '',
      form: {},
      values: [],
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      selected: {
        label: '',
        value: '',
      },
    };
  },

  watch: {
    tabs(val, prevVal) {
      // 默认选择第一个tab
      if (val && getJSONString(val) !== getJSONString(prevVal)) {
        this.activeTab = Object.keys(val)[0];
      }
    },

    activeTab: {
      deep: true,
      handler() {
        this.handleSearch();
      },
    },

    checkedValue(val) {
      for (const itemData of this.tableData) {
        if (itemData[this.primaryField] === val) {
          const formattedLabel = this.formatSearchLabel(
            this.activeTab,
            itemData[this.primaryNameField]
          );
          this.selected = {
            value: val,
            type: this.activeTab,
            label: formattedLabel,
          };
          return;
        }
      }
    },

    values: {
      deep: true,
      handler(val) {
        const formattedVal = val.map((item) => {
          const { _key, _label, ...restVal } = item;
          return restVal;
        });
        this.$emit('input', formattedVal);
      },
    },

    defaultValue: {
      deep: true,
      handler(val, prevVal) {
        this.initValues(val);
        // if (getJSONString(val) !== getJSONString(prevVal)) {
        // }
      },
    },
  },

  computed: {
    tableColumn() {
      const defaultCol = [
        {
          title: ' ',
          slot: 'selector',
          width: 40,
          align: 'center',
        },
      ];
      return defaultCol.concat(this.columns);
    },
  },

  methods: {
    resetForm() {
      this.form = {};
      this.checkedValue = '';
      this.selected = {
        label: '',
        value: '',
      };
    },

    // 回显值
    initValues(initData = []) {
      if (initData.length < 1) return this.values = []

      const tabField = this.tabField;
      const primaryField = this.primaryField;
      const primaryValues = initData.map((item) => item[primaryField]);

      // 搜索&拼装
      this.runSearchHandler({
        [primaryField]: primaryValues,
        pagination: {
          currentPage: 1,
          pageSize: MAX_PAGESIZE,
        },
      })
        .then(({ data }) => {
          const dataMap = {};
          const fields = this.fields;
          const primaryNameField = this.primaryNameField;

          data.forEach((item) => {
            const key = this.getUiqueKey(item[tabField], item[primaryField]);
            dataMap[key] = item[primaryNameField];
          });

          const values = initData.map((item) => {
            const uniqueKey = this.getUiqueKey(
              item[tabField],
              item[primaryField]
            );
            const formattedValue = {
              _key: itemIndex++,
              [tabField]: item[tabField],
              [primaryField]: item[primaryField],
            };

            const primaryLabel = dataMap[uniqueKey] || '-';
            const formattedLabel = [primaryLabel];

            Object.keys(fields).forEach((field) => {
              formattedLabel.push(item[field]);
              formattedValue[field] = item[field];
            });

            formattedValue._label = formattedLabel.join(VALUE_DIVIDER);

            return formattedValue;
          });

          this.values = values;
        })
        .catch(() => {
          this.values = [];
        });
    },

    getUiqueKey(tab, field) {
      return `${tab}-${field}`;
    },

    onTabActive(record) {
      this.activeTab = record.value;
      this.pagination.total = 0;
      this.pagination.currentPage = 1;
    },

    onSelectOpen() {
      this.visible = true;
    },

    onSelectCancel() {
      this.visible = false;
    },

    // 添加值
    onAdd() {
      const selected = this.selected;
      const formValues = this.form;
      const formattedLabel = [selected.label];

      Object.keys(this.fields).forEach((key) => {
        formattedLabel.push(formValues[key]);
      });

      this.visible = false;
      this.values.push({
        _key: itemIndex++,
        _label: formattedLabel.join(VALUE_DIVIDER),
        [this.tabField]: selected.type,
        [this.primaryField]: selected.value,
        ...formValues,
      });
      this.resetForm();
    },

    // 删除选中值
    onDelete(record) {
      const values = this.values;
      this.values = values.filter((item) => item._key !== record._key);
    },

    onSearch() {
      this.handleSearch();
    },

    onPageChange(page) {
      this.pagination.currentPage = page;
      this.$nextTick(() => {
        this.handleSearch();
      });
    },

    handleSearch() {
      this.loading = true;

      const params = {
        [this.tabField]: this.activeTab,
        pagination: this.pagination,
      };

      this.runSearchHandler(params, this.query)
        .then(({ data, total }) => {
          this.tableData = data;
          this.pagination.total = total;
        })
        .catch(() => {
          this.tableData = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },

    runSearchHandler(params, query) {
      if (isFunction(this.searchHandler)) {
        const searchRes = this.searchHandler(query, params);

        // searchHandler需返回Promise
        if (process.env.NODE_ENV === 'development') {
          if (!isPromise(searchRes)) {
            return Promise.reject(
              new ComponentError(
                'SearchableSelect',
                'searchHandler needs return a Promise'
              ).showError()
            );
          }
        }

        return new Promise((resolve, reject) => {
          searchRes
            .then(({ data = [], total }) => {
              resolve({ data, total });
            })
            .catch(() => {
              reject();
            });
        });
      }
    },

    formatSearchLabel(type, name) {
      return `${this.tabs[type]}${LABEL_DIVIDER}${name}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/style/index.scss';
.s-searchable-select {
  &-select {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &-active {
      .s-searchable-select-select-icon {
        transform: rotate(180deg);
      }

      .s-searchable-select-select-input {
        ::v-deep {
          .ivu-input {
            border: 1px solid $border-color-input-focus;
            box-shadow: $box-shadow-input-focus;
          }
        }
      }
    }

    &-selector {
      position: relative;
      width: 280px;
      margin-right: 8px;
    }

    &-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    &-icon {
      position: absolute;
      right: 8px;
      top: 50%;
      margin-top: -7px;
      color: #808695;
      transition: transform $transition-easeinout-001;
    }

    &-input {
      transition: all $transition-easeinout-001;
    }

    &-countor {
      width: 150px;
      margin-right: 16px;
    }

    &-ops {
      display: flex;
      justify-content: flex-end;

      ::v-deep {
        .ivu-btn {
          margin-left: 8px;
        }
      }
    }
  }
  &-list {
    &-wrap {
      position: relative;
      padding-top: 8px;
      background-color: #ffffff;
    }

    .inner-wrap {
      display: flex;
      border: 1px solid $border-color;
      border-radius: $border-radius-md;

      ::v-deep {
        .ivu-input {
        }
        .tab-item {
          list-style: none;
        }
      }
    }

    .left-wrap {
      width: 25%;
      padding: 16px;
      border-right: 1px dashed $border-color;

      .tab-item {
        padding: 4px 10px;
        margin-bottom: 16px;
        cursor: pointer;
        font-size: $font-size-text;
        text-align: center;
        color: $text-color;
        background-color: $dark-bg;
        border-radius: $border-radius-md;
        transition: all $transition-easeinout-001;

        &-active {
          color: $link-color;
          background-color: $link-bg;
        }

        &:hover {
          transform: translateY(-2px);
        }
      }
    }

    .right-wrap {
      width: 75%;
      padding: 16px;

      .name-search {
        position: relative;
        .search-icon {
          position: absolute;
          top: 9px;
          right: 8px;
          cursor: pointer;
        }
        .search-input {
          margin-bottom: 12px;
        }
      }

      .table-radio {
        width: 20px;
        height: 20px;
        padding-left: 2px;
        overflow: hidden;
      }

      ::v-deep {
        .ivu-table-tip {
          font-size: $font-size-text;
        }

        .ivu-table-cell {
          padding-left: 12px;
          padding-right: 12px;
          font-size: $font-size-text;
          font-weight: $font-weight-light;
        }
      }
    }
  }

  &-pagination {
    margin-top: 8px;
    text-align: right;

    ::v-deep {
      .ivu-page-item,
      .ivu-page-next,
      .ivu-page-prev,
      .ivu-page-item-jump-next,
      .ivu-page-item-jump-prev {
        min-width: 26px;
        height: 26px;
        line-height: 24px;
        font-size: $font-size-text;
      }
    }
  }
}
</style>
