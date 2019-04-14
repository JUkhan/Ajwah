import Vue from 'vue';
import App from './App.vue';
import router from './router';

import vueRx from 'vue-rx';
import { AjwahStore, } from 'ajwah-store';
import { devTools } from 'ajwah-devtools';
//import counterState from './states/counterState'
import counterState from './states/counterState2'

Vue.use(vueRx);

Vue.use(AjwahStore, {
  states: [counterState],
  devTools: devTools(),
  exposeStore: true
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
