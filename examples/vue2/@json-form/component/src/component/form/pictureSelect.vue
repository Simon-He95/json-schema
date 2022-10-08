<template>
  <div class="s-picture-select">
    <ul class="s-picture-select-list">
      <li
        v-for="(item, key) in dataSource"
        :class="[
          's-picture-select-item',
          values.includes(key) ? 's-picture-select-item-active' : '',
        ]"
        :title="item.title"
        :key="key"
        @click="onClick(key, item)"
      >
        <img
          class="s-picture-select-item-thumb"
          :src="item.url"
          :alt="item.title"
        />
        <div class="s-picture-select-item-check">
          <Icon type="md-checkmark" />
        </div>
      </li>
    </ul>
    <div class="s-picture-select-values">
      已选：{{ this.titles.join(' / ') || '--' }}
    </div>
  </div>
</template>

<script>
import { getJSONString } from '@/utils/utils';
import { isArray } from '@/utils/type';

// TODO: 多选
export default {
  name: 'SilentPictureSelect',
  props: {
    dataSource: {
      type: Object,
      default: () => {
        return {};
      },
    },
    multiple: Boolean,
    value: String | Array,
  },

  watch: {
    value: {
      deep: true,
      handler(val, prevVal) {
        if (getJSONString(val) !== getJSONString(prevVal)) {
          let data = val;
          if (!isArray(val)) data = [val];
          this.values = data;
          this.titles = this.formatValues(data);
        }
      },
    },

    values: {
      deep: true,
      handler(val) {
        if (val) {
          let finalValue = val;

          if (!this.multiple) {
            finalValue = val[0] || '';
          }

          this.$emit('input', finalValue);
        }
      },
    },
  },

  data() {
    return {
      values: [],
      titles: [],
    };
  },

  methods: {
    onClick(field, record) {
      const prevValues = this.values;
      const prevTitles = this.titles;
      if (prevValues.includes(field)) {
        this.values = prevValues.filter((item) => item !== field);
        this.titles = prevTitles.filter((item) => item !== record.title);
        return;
      }
      this.values = [field];
      this.titles = [record.title];
    },

    formatValues(values = []) {
      const dataSource = this.dataSource;
      return values.map((value) => {
        for (const key in dataSource) {
          if (key === value) {
            return dataSource[key].title;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/style/index.scss';
.s-picture-select {
  &-list {
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
  }

  &-item {
    position: relative;
    width: 56px;
    height: 56px;
    margin: 8px;
    cursor: pointer;
    overflow: hidden;
    border-radius: $border-radius-lg;
    opacity: 0.8;
    transition: all $transition-easeinout-001;

    &:hover {
      transform: translateY(-2px);
      opacity: 1;
      box-shadow: $box-shadow-blue;
    }

    &-thumb {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-check {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 3px;
      right: 3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: $info-color;
      color: $white-001;
      font-size: $font-size-text;
      opacity: 0;
    }

    &-active {
      box-shadow: $box-shadow-blue;
      opacity: 1;
    }
    &-active &-check {
      opacity: 1;
    }
  }

  &-values {
    margin-top: 12px;
    font-size: $font-size-text;
    line-height: 1.5;
    color: $text-light-color;
  }
}
</style>
