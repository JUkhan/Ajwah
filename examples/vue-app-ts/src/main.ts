import Vue from 'vue';
import App from './App.vue';
import router from './router';

import vueRx from 'vue-rx';
import { AjwahStore } from 'ajwah-vue-store';
import { devTools } from 'ajwah-devtools';
import counterState from './states/counterState'

Vue.use(vueRx);

Vue.use(AjwahStore, {
  states: [counterState],
  devTools: devTools()
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
