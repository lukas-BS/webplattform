import OverviewApp from './OverviewApp.vue';
// import { VueSelect } from 'vue-select';
import { createApp } from 'vue';

if (document.getElementById('overview-app')) {
  const app = createApp(OverviewApp);
  // app.component('v-select', VueSelect);
  app.mount('#overview-app');
}
