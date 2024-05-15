import TeachingModuleSubmissionApp from './TeachingModuleSubmissionApp.vue';
import { createApp } from 'vue';
import { tooltip } from '../directives/tooltip';

if (document.getElementById('teaching-module-submission')) {
  const app = createApp(TeachingModuleSubmissionApp);
  app.directive('tooltip', tooltip);
  app.mount('#teaching-module-submission');
}
