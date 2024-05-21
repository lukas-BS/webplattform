import { createApp } from 'vue';

import { tooltip } from '../directives/tooltip';
import CompetenceFilterApp from './CompetenceFilterApp.vue';

if (document.getElementById('filter-app')) {
  const app = createApp(CompetenceFilterApp);
  app.directive('tooltip', tooltip);
  app.mount('#filter-app');
}
