import TestimonialOverviewApp from './TestimonialOverviewApp.vue';
import { createApp } from 'vue';
import { tooltip } from '../directives/tooltip';

if (document.getElementById('testimonial-overview-app')) {
  const app = createApp(TestimonialOverviewApp);
  app.directive('tooltip', tooltip);
  app.mount('#testimonial-overview-app');
}
