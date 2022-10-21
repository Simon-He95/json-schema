<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import { ElMessage } from 'element-plus'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { nextTick, onMounted, ref } from 'vue'
import json from './schema.json'
const schema = ref({})
const formEl = ref()
const value = JSON.stringify(json, null, 2)
const extensions = [javascript(), oneDark]

onMounted(() => {
  schema.value = json
})

async function submit() {
  const { status, result } = await formEl.value.submit()
  if (status) {
    const message = JSON.stringify(result, null, 2)
    console.log(message)
    ElMessage({
      showClose: true,
      message,
      type: 'success',
    })
  }
  else {
    ElMessage({
      showClose: true,
      message: result[0],
      type: 'error',
    })
  }
}
const inputChange = (content: string) => {
  nextTick(() => {
    try {
      schema.value = JSON.parse(content)
    }
    catch (error) {}
  })
}
</script>

<template>
  <div p-y-4 flex="~ gap-20" px-5>
    <div w-full>
      <my-schema ref="formEl" :schema="schema" />
      <el-button @click="submit">
        submit
      </el-button>
    </div>
    <Codemirror
      id="monaco"
      v-model="value"
      w-full
      h-full
      width="100%"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @change="inputChange"
    />
  </div>
</template>

<style scoped>
#monaco >>> .cm-editor {
  height: 100%;
  width: 100%;
}
</style>
