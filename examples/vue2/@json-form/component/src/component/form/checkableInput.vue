<template>
  <div class="silent-checkable-input">
    <Checkbox v-model="checked">{{label}}</Checkbox>
    <InputNumber v-model="inputValue" v-if="checked && (type === 'number')" />
    <Input v-model="inputValue" v-else-if="checked" />
  </div>
</template>

<script>
export default {
  name: 'SilentCheckableInput',
  props: {
    type: String, // enum: default、number
    label: String,
    value: String | Number,
  },

  data () {
    return {
      checked: false,
      inputValue: '',
    }
  },

  watch: {
    value (val, prevVal) {
      if (val !== prevVal) {
        if (val) {
          this.checked = true
          this.inputValue = val
        } else {
          this.checked = false
          this.inputValue = ''
        }
      }
    },

    inputValue (val) {
      this.checked && this.$emit('input', val)
    },

    checked (val) {
      if (!val) {
        this.inputValue = ''
        this.$emit('input', '')
      }
    },
  },
}
</script>