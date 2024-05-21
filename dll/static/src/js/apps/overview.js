import { createApp } from 'vue'

import { tooltip } from '../directives/tooltip'
import OverviewApp from './OverviewApp.vue'

if (document.getElementById('overview-app')) {
  const app = createApp(OverviewApp)
  app.directive('tooltip', tooltip)
  app.mount('#overview-app')
}
