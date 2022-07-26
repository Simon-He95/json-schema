import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import ElementPlus from 'element-plus'
// import { jsonSchemaTransformForm } from 'json-schema-transform-form'
import { jsonSchemaTransformForm } from '../../src'
import App from './App.vue'
import 'element-plus/dist/index.css'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.use(ElementPlus)
app.component('MySchema', jsonSchemaTransformForm)
app.mount('#app')
