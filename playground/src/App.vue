<script setup lang="ts">
const json = {
  title: '测试注册表单',
  description: 'A simple form example.',
  class: 'w-200',
  form: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Jun',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
      rule: '必须输入Last Name',
    },
    price: {
      type: 'string',
      description: '最多输入两位小数点，最大值 999999.99',
      title: '价格',
      format: 'price',
    },
    age: {
      type: 'number',
      title: 'Age',
      maximum: 80,
      minimum: 16,
    },
    bio: {
      type: 'string',
      title: 'Bio',
      minLength: 10,
    },
    password: {
      type: 'string',
      title: 'Password',
      minLength: 3,
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
    },
    date: {
      title: '日期',
      type: 'datepicker',
    },
    select: {
      type: 'select',
      title: 'Activity zone',
      options: ['Zone one', 'Zone two'],
      values: ['1', '2'],
    },
    switch: {
      type: 'switch',
      title: '开关',
    },
    radio: {
      type: 'radio',
      title: '单选',
      options: ['选项一', '选项二'],
    },
    checkbox: {
      type: 'checkbox',
      title: '多选',
      options: ['选项一', '选项二'],
    },
  },
}
const schema = ref(null)
const jsonData = ref(null)

onMounted(() => {
  jsonData.value = schema.value.getFormData()
})
</script>

<template>
  <my-schema ref="schema" :schema="json" />
  <div class="color-$el-text-color-primary">
    {{ jsonData }}
  </div>
</template>

<style scoped></style>
