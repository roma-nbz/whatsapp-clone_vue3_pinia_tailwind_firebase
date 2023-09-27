import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vue3GoogleLogin, {
	clientId: '74742117989-iumln6qqtgntmro3bo9k4421627239ru.apps.googleusercontent.com',
})

app.mount('#app')
