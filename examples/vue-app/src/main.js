import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import store from './store'
import vueRx from 'vue-rx'
import { AjwahStore } from 'ajwah-vue-store';
import counterState from './states/counterState';
import tutorialState from './states/tutorialState';
import todoState from './states/todoState';
import { devTools } from 'ajwah-react-devtools'

Vue.use(vueRx)

Vue.use(AjwahStore, {
  states: [counterState, tutorialState, todoState],
  devTools: devTools({ name: 'vue devTools' })
})

Vue.config.productionTip = false

new Vue({
  router,
  //store,
  render: h => h(App)
}).$mount('#app')
