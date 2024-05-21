import { createApp } from 'vue';

import { tooltip } from '../directives/tooltip';
import TeachingModulesFilterApp from './TeachingModulesFilterApp.vue';

if (document.getElementById('teaching-modules-app')) {
  const app = createApp(TeachingModulesFilterApp);
  app.directive('tooltip', tooltip);
  app.mount('#teaching-modules-app');
}
