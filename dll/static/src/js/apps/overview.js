import { createApp } from 'vue'
import OverviewApp from './OverviewApp.vue'

if (document.getElementById('overview-app')) {
  createApp(OverviewApp).mount('#overview-app')
}
