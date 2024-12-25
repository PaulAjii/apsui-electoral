import './assets/main.css'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { GiVote, GiMuscleUp, BiArrowUpRight, BiPlus } from 'oh-vue-icons/icons'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

addIcons(GiVote, GiMuscleUp, BiArrowUpRight, BiPlus)
app.component('v-icon', OhVueIcon)

app.mount('#app')
