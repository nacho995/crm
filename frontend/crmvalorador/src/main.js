import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
})

// Asegurar que la aplicación use todo el ancho de pantalla
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.width = '100%'
  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.documentElement.style.width = '100%'
  document.documentElement.style.height = '100%'
})

app.mount('#app')
