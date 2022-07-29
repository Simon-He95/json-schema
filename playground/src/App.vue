<script setup lang="ts">
import json from './schema.json'
const schema = ref(null)
const jsonData = ref(null)

onMounted(() => {
  jsonData.value = schema.value.getFormData()
})
async function submit() {
  const result = await schema.value.submit()
  // if (result) console.log("can submit", result);
  // else console.log("cannot submit");
}
</script>

<template>
  <div p-y-4 flex="~ gap-20" px-5>
    <div w-full>
      <my-schema ref="schema" :schema="json" />
      <el-button @click="submit">
        submit
      </el-button>
    </div>
    <div px-10 bg-dark-500 color-white:70 w-full>
      {
      <div v-for="(value, key, i) in jsonData" :key="key">
        "{{ key }}": "{{ value }}"{{ i === Object.keys(jsonData).length - 1 ? "" : "," }}
      </div>
      }
    </div>
  </div>
</template>
