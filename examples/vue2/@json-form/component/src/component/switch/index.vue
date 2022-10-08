<template>
  <iv-switch class="silent-commond-switch" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
import { Switch as IvSwitch } from 'view-design'

export default {
  name: 'SilentCommondSwitch',
  components: {
    IvSwitch,
  },
}
</script>