import TrendFilterApp from './TrendFilterApp.vue';
import { createApp } from 'vue';
import { tooltip } from '../directives/tooltip';

if (document.getElementById('trends-app')) {
  const app = createApp(TrendFilterApp);
  app.directive('tooltip', tooltip);
  app.mount('#trends-app');
}
