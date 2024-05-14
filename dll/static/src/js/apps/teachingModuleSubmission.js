import TeachingModuleSubmissionApp from './TeachingModuleSubmissionApp.vue';
import { createApp } from 'vue';

if (document.getElementById('teaching-module-submission')) {
  const app = createApp(TeachingModuleSubmissionApp);
  app.mount('#teaching-module-submission');
}
