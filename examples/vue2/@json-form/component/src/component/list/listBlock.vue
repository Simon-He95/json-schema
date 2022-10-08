<template>
  <div>
    <h4 class="command-menu-list-title-wrap">
      <div class="command-menu-list-title">{{title}}<Icon type="md-arrow-dropdown" /></div>
      <div class="command-menu-list-total">{{dataSource.length}}</div>
    </h4>
    <ul class="command-menu-list">
      <li v-for="item in dataSource" :class="['command-menu-item', active === item.id ? 'command-menu-item-active' : '']" :key="item.id">
        <a class="command-menu-item-nav" @click="changeActive(item.id)">
          <div><jf-icon icon="dot" />{{ item.name }}</div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import JFIcon from '../icon/index.vue'

export default {
  name: 'MenuBlock',
  props: {
    title: String,
    active: String,
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  components: {
    JFIcon,
  },

  methods: {
    changeActive (key) {
      this.$emit('change', key)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../style/index.scss";

.command-menu {

  &-list-title {
    vertical-align: middle;
    cursor: pointer;

    &-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px 8px 24px;
      height: 34px;
      color: $command-subtext-color;
      font-size: $font-size-text;
      font-weight: $font-weight-bold;
  
      ::v-deep {
        .ivu-icon {
          margin-left: 4px;
        }
      }
    }
  }

  &-list-total {
    padding: 4px;
    min-width: 20px;
    border-radius: $border-radius-md;
    background-color: $command-bg-dark;
    text-align: center;
  }

  &-item {
    position: relative;
    list-style: none;

    &-nav {
      display: block;
      padding: 8px 0 8px 32px;
      list-style: desc;
      color: $command-text-color;

      &:hover {
        color: $command-text-color;
      }

      & > div {
        display: flex;
        align-items: center;
      }
    }

    ::v-deep {
      .silent-icon {
        width: 4px;
        height: 4px;
        margin: 0 8px;
        & > * {
          fill: $command-subtext-color;
        }
      }
    }

    &-active {
      background-color: $command-bg-primary;
      border-right: 2px solid $command-primary-color;
      font-weight: $font-weight-bold;
    }

    &-active &-nav {
      color: $command-primary-color;

      ::v-deep {
        .silent-icon {
          & > * {
            fill: $command-primary-color;
          }
        }
      }
    }
  }
}
</style>