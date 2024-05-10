import { createApp } from 'vue';
import CompetenceFilterApp from './CompetenceFilterApp.vue';
import { tooltip } from '../directives/tooltip';

if (document.getElementById('filter-app')) {
  const app = createApp(CompetenceFilterApp);
  app.directive('tooltip', tooltip);
  app.mount('#filter-app');
}
