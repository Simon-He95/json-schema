import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import ElementPlus from 'element-plus'
import { mySchema } from '../../src'
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
app.component('MySchema', mySchema)
app.mount('#app')
