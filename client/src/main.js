import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './routers'
import { createDiscreteApi } from 'naive-ui'
import axios from 'axios'
import { useAdminStore } from "./stores"

axios.defaults.baseURL = 'http://localhost:8019'

const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])

const app = createApp(App)

// 全局提供属性
app.provide("axios", axios)
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("server_url", axios.defaults.baseURL)
app.use(createPinia())
app.use(router)

const adminStore = useAdminStore()
// axios拦截器
axios.interceptors.request.use((config) => {
    //每次请求都在headers中添加token
    config.headers.token = adminStore.token
    return config
})


app.mount('#app')
