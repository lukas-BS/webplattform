import { createApp } from 'vue'
import CompetenceFilterApp from './CompetenceFilterApp.vue'

if (document.getElementById('filter-app')) {
  createApp(CompetenceFilterApp).mount('#filter-app')
}
