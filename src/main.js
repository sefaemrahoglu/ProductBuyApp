import Vue from 'vue'
import App from './App.vue'
import { router } from "./router";
import { store } from "./store/store";
import VueResource from 'vue-resource';

Vue.config.productionTip = false;

Vue.filter("currency", (value) => {
  return parseFloat(value).toLocaleString(undefined, {minimumFractionDigits : 2 }) + "₺";
})

Vue.use(VueResource);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
