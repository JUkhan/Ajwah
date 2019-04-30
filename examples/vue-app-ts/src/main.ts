import Vue from 'vue';
import App from './App.vue';
import router from './router';

import vueRx from 'vue-rx';
import { setStoreContext } from 'ajwah-store';
import { devTools } from 'ajwah-devtools';
//import counterState from './states/counterState'
import counterState from './states/counterState2'

Vue.use(vueRx);

setStoreContext({
  states: [counterState],
  devTools: devTools()
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
