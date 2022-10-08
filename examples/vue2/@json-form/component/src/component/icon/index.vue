<template>
<component :class="['jf-icon', `jf-icon-${icon}`]" :color="color" :is="svgMap[icon]"></component>
</template>

<script>
import svgMap from './svg'

export default {
  name: 'JFIcon',
  props: {
    icon: String,
    color: String,
  },

  data () {
    this.svgMap = svgMap
    return {}
  },
}
</script>