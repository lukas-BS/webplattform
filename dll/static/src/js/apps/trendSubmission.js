import { createApp } from 'vue'

import { tooltip } from '../directives/tooltip'
import TrendSubmissionApp from './TrendSubmissionApp.vue'

if (document.getElementById('trend-submission')) {
  const app = createApp(TrendSubmissionApp)
  app.directive('tooltip', tooltip)
  app.mount('#trend-submission')
}
