<template>
  <ul class="command-form-item-card">
    <li
      v-for="(item, field) in dataSource"
      :class="['command-form-item-card-item', item.disabled ? 'command-form-item-card-item-disabled' : '']"
      :key="field"
      :title="item.disabled ? '暂未开放支持' : ''"
      @click="onClick(field, item)"
    >
      <div class="command-form-item-card-item-inner">
        <JFIcon :icon="item.icon" />
        <div class="command-form-item-card-item-info">
          <div>{{item.name}}<span>{{field}}</span></div>
          <p>{{item.desc}}</p>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import JFIcon from '../icon/index.vue'

export default {
  name: 'FormItemCard',
  components: {
    JFIcon,
  },
  props: {
    dataSource: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },

  methods: {
    onClick (field, record) {
      if (record.disabled) return
      this.$emit('select', field)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../style/index.scss";
.command-form-item-card {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0px;

  &-item {
    
    grid-column: span 6 / auto;
    margin-bottom: 6px;
    padding: 16px;
    border: 1px solid $command-border-color;
    border-radius: $border-radius-md;
    list-style: none;
    cursor: pointer;

    &-inner {
      display: flex;
      align-items: center;
    }

    &:hover {
      background-color: $command-bg-primary;
    }

    &:nth-of-type(odd) {
      margin-right: 8px;
    }

    &:nth-of-type(even) {
      margin-left: 8px;
    }

    &-info {
      flex-grow: 1;
      margin-left: 16px;

      & > div {
        font-weight: $font-weight-bold;
        font-size: $command-font-size-title-desc;
        color: $command-text-color;

        & > span {
          margin-left: 8px;
          font-weight: $font-weight-light;
          font-size: $font-size-text;
        }
      }
      & > p {
        margin-top: 2px;
        font-size: $font-size-text;
        color: $command-subtext-color;
      }
    }
    
    &-disabled {
      filter: grayscale(1);
      cursor: not-allowed;
      background-color: #eee;
    }

    ::v-deep {
      .jf-icon {
        flex-shrink: 0;
        flex-grow: 0;
        width: 32px;
        height: 24px;
      }
    }
  }
}
</style>