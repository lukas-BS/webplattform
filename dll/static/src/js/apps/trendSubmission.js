import TrendSubmissionApp from './TrendSubmissionApp.vue';
import { createApp } from 'vue';
import { tooltip } from '../directives/tooltip';

if (document.getElementById('trend-submission')) {
  const app = createApp(TrendSubmissionApp);
  app.directive('tooltip', tooltip);
  app.mount('#trend-submission');
}
