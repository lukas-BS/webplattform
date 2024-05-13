import ToolFilterApp from './ToolFilterApp.vue';
import { createApp } from 'vue';
import { tooltip } from '../directives/tooltip';

if (document.getElementById('tools-app')) {
  const app = createApp(ToolFilterApp);
  app.directive('tooltip', tooltip);
  app.mount('#tools-app');
}
