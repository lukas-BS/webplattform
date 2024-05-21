import { createApp } from 'vue'

import { tooltip } from '../directives/tooltip'
import ToolSubmissionApp from './ToolSubmissionApp.vue'

if (document.getElementById('tool-submission')) {
  const app = createApp(ToolSubmissionApp)
  app.directive('tooltip', tooltip)
  app.mount('#tool-submission')
}
