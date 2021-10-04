import { createApp } from 'vue'
import App from './App.vue'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import 'windi.css'

const app = createApp(App)

app.use(
  VueTippy,
  // optional
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>
  }
)

app.mount('#app')
