import OverviewApp from './OverviewApp.vue';
import { createApp } from 'vue';
import { tooltip } from '../directives/tooltip';

if (document.getElementById('overview-app')) {
  const app = createApp(OverviewApp);
  app.directive('tooltip', tooltip);
  app.mount('#overview-app');
}
