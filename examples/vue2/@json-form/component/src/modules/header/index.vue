<template>
  <div class="jf-header">
    <div class="jf-header-top" v-if="hasBack">
      <div class="jf-header-back" @click="onBack">
        <JFIcon icon="arrow" />
        <span>返回</span>
      </div>
    </div>
    <div class="jf-header-info">
      <h4>
        <span class="jf-header-title">{{ title }}</span>
        <slot name="titleExtra"></slot>
      </h4>
      <div class="jf-header-opts">
        <slot name="opts"></slot>
      </div>
    </div>
    <div class="jf-header-desc">{{ description }}</div>
  </div>
</template>

<script>
import { JFIcon } from '../../component';
export default {
  name: 'Header',
  components: {
    JFIcon,
  },
  props: {
    title: String,
    description: String,
    hasBack: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/index.scss';
.jf-header {
  padding: 32px 0;

  &-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $command-text-color;

    & > h4 {
      display: flex;
      align-items: center;
    }
  }

  &-title {
    display: flex;
    margin-right: 16px;
    font-size: $command-font-size-title-large;
    font-weight: $font-weight-bold;
  }

  &-opts {
    flex-shrink: 0;
    flex-grow: 0;

    ::v-deep {
      .ivu-btn {
        margin-left: 8px;
      }
    }
  }

  &-desc {
    margin-top: 16px;
    text-align: left;
    line-height: 1.55;
    font-size: $command-font-size-title-desc;
    color: $command-subtext-color;
    font-weight: $font-weight-light;
  }

  &-back {
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
    color: $command-primary-color;

    &:hover {
      ::v-deep {
        .silent-icon {
          margin-right: 16px;
        }
      }
    }

    ::v-deep {
      .silent-icon {
        width: 10px;
        height: 10px;
        margin-right: 12px;
        transition: margin $transition-easeinout-001;

        & > * {
          fill: $command-primary-color;
        }
      }
    }
  }
}
</style>
