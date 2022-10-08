<template>
  <div class="command-table-wrap">
    <div class="command-table">
      <Table :columns="formattedColumns" :data="dataSource" :loading="loading">
        <template v-for="col in slotColumns" v-slot:[col.key]="{ row, index }">
          <div
            v-if="col.clickable"
            class="command-table-cell-clickable"
            :title="col.clickTips"
            @click="(e) => onCellClick(e, row, index, col.key)"
          >
            <slot :name="col.slot" :row="row" :index="index"></slot>
          </div>
          <slot :name="col.slot" :row="row" :index="index" v-else></slot>
        </template>
      </Table>
    </div>

    <div class="command-pagination" v-if="pagination">
      <Page
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :model-value="pagination.currentPage"
        :show-total="true"
        :show-sizer="showSizer"
        @on-change="onChange"
        @on-page-size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommandTable',
  props: {
    loading: Boolean,
    showSizer: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    dataSource: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pagination: Object,
  },

  computed: {
    formattedColumns() {
      return this.columns.map((item) => {
        return {
          ...item,
          ...(item.clickable ? { slot: item.key } : {}),
        };
      });
    },

    slotColumns() {
      return this.columns
        .filter((item) => item.slot || item.clickable)
        .map((item) => {
          return {
            ...item,
            slot: item.slot || item.key,
          };
        });
    },
  },

  methods: {
    onCellClick(e, record, index, colKey) {
      this.$emit('cell-click', record, colKey, e, index);
    },

    onChange(page) {
      this.$emit('page-change', page);
    },

    onPageSizeChange(pageSize) {
      this.$emit('page-size-change', pageSize);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/index.scss';
$pagination-margin: 20px;
$page-options-width: 100px;
$page-height: 32px;
$page-option-dropdown-height: 30px;
$page-option-dropdown-line-height: 28px;
.command-table {
  padding: 0 24px;
  box-shadow: $command-box-shadow;
  border-radius: $border-radius-md;
  background-color: $white-001;

  ::v-deep {
    .ivu-table-wrapper {
      border: none;
    }

    .ivu-table th {
      background-color: $white-001;
    }

    th .ivu-table-cell {
      color: $command-subtext-color;
    }

    .ivu-table-cell {
      color: $command-text-color;
      font-size: $font-size-text;
    }

    .ivu-table-header thead tr th {
      padding: 14px 0;
    }

    .ivu-table-tip {
      color: $command-subtext-color;
      font-size: $font-size-text;
    }

    .ivu-table tr:last-of-type td {
      border: none;
    }

    .ivu-table:before {
      background-color: transparent;
    }

    tr.ivu-table-row-hover td {
      background-color: transparent;
    }

    .command-table-cell-clickable {
      cursor: pointer;
      color: $command-primary-color;
    }
  }
}

.command-pagination {
  margin-top: $pagination-margin;
  margin-bottom: $pagination-margin;
  ::v-deep {
    .ivu-page {
      text-align: right;
      color: $command-text-color;
      line-height: $page-height;
      height: $page-height;

      &-item {
        background-color: $command-bg;
        border: none;
        line-height: $page-height;
        height: $page-height;

        a {
          color: $command-text-color;
        }

        &-active {
          box-shadow: 0px 1px 3px $command-border-color-primary;
          background-color: $command-bg-mask;

          a {
            color: $command-primary-color;
          }
        }

        &:hover {
          a {
            color: $command-text-color;
          }
          box-shadow: 0px 1px 5px $command-border-color-primary;
        }
      }

      &-prev,
      &-next {
        border: none;
        background-color: $command-bg;
        line-height: $page-height;
        height: $page-height;
        a {
          color: $gray-004;
        }
        &:hover {
          a {
            color: $command-text-color;
          }
        }
      }
      &-disabled {
        a,
        &:hover {
          color: $gray-005 !important;
        }
      }
    }
    .ivu-page-options {
      float: left;
      margin-left: 0;
      line-height: $page-height;
      height: $page-height;
      .ivu-select {
        color: $command-text-color;
        width: $page-options-width;
        text-align: center;
        &-selection {
          line-height: $page-height;
          height: $page-height;
          background-color: $white-001;
          border: 0.5px solid $command-border-color;
          .ivu-select-selected-value {
            line-height: $page-height;
            height: $page-height;
          }
        }
        .ivu-select {
          &-dropdown {
            background-color: $white-001;
            &-item {
              color: $command-text-color !important;
            }
          }
        }
      }

      .ivu-page-options-sizer {
        .ivu-select-dropdown {
          .ivu-select-item {
            color: $command-text-color;
            height: $page-option-dropdown-height;
            line-height: $page-option-dropdown-line-height;
            &:hover {
              background-color: $command-bg-primary !important;
            }
            &:active {
              color: $command-text-color !important;
            }
            &-selected {
              background-color: $command-bg-primary !important;
              color: $command-primary-color !important;
              font-weight: $font-weight-bold;
            }
          }
        }
      }
    }

    .ivu-select-visible .ivu-select-selection {
      &:hover {
        border: 0.5px solid $command-primary-color;
      }
      &:active {
        border: 0.5px solid $command-primary-color;
      }
      &:focus {
        border: 0.5px solid $command-primary-color;
      }
    }
    .ivu-page-options {
      float: left;
      margin-left: 0;
      .ivu-select {
        color: $command-text-color;
        width: $page-options-width;
        text-align: center;
        &-selection {
          line-height: $page-height;
          height: $page-height;
          background-color: $white-001;
          border: 0.5px solid $command-border-color;
          .ivu-select-selected-value {
            line-height: $page-height;
            height: $page-height;
          }
        }
        .ivu-select {
          &-dropdown {
            background-color: $white-001;
            &-item {
              color: $command-text-color !important;
            }
          }
        }
      }

      .ivu-page-options-sizer {
        .ivu-select-dropdown {
          .ivu-select-item {
            color: $command-text-color;
            height: $page-option-dropdown-height;
            line-height: $page-option-dropdown-height;
            &:hover {
              background-color: $command-bg-primary !important;
            }
            &:active {
              color: $command-text-color !important;
            }
            &-selected {
              background-color: $command-bg-primary !important;
              color: $command-primary-color !important;
              font-weight: $font-weight-bold;
            }
          }
        }
      }
    }

    .ivu-select-visible .ivu-select-selection {
      &:hover {
        border: 0.5px solid $command-primary-color;
      }
      &:active {
        border: 0.5px solid $command-primary-color;
      }
      &:focus {
        border: 0.5px solid $command-primary-color;
      }
    }
  }
}
</style>
