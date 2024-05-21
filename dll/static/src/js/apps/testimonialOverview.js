import { createApp } from 'vue';

import { tooltip } from '../directives/tooltip';
import TestimonialOverviewApp from './TestimonialOverviewApp.vue';

if (document.getElementById('testimonial-overview-app')) {
  const app = createApp(TestimonialOverviewApp);
  app.directive('tooltip', tooltip);
  app.mount('#testimonial-overview-app');
}
