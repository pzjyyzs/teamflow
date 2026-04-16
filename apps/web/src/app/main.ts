import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '../style.css'
import App from '../App.vue'
import router from '../app/router'
import { useAuthStore } from '../features/auth/store/auth.store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const auth = useAuthStore(pinia)
void auth.restoreSession().finally(() => {
  app.use(router).mount('#app')
})
