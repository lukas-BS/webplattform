import { createApp } from 'vue'

import { tooltip } from '../directives/tooltip'
import ToolFilterApp from './ToolFilterApp.vue'

if (document.getElementById('tools-app')) {
  const app = createApp(ToolFilterApp)
  app.directive('tooltip', tooltip)
  app.mount('#tools-app')
}
