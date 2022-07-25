<script setup lang="ts">
import json from './schema.json'
const schema = ref(null)
const jsonData = ref(null)

onMounted(() => {
  jsonData.value = schema.value.getFormData()
})
</script>

<template>
  <div p-y-4 flex="~ gap-20" px-5>
    <my-schema ref="schema" :schema="json" w-full />
    <div px-10 bg-dark-500 color-white:70 w-full>
      {
      <div v-for="(value, key, i) in jsonData" :key="key">
        "{{ key }}": "{{ value }}"{{ i === Object.keys(jsonData).length - 1 ? "" : "," }}
      </div>
      }
    </div>
  </div>
</template>

<style scoped></style>
