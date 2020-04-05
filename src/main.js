import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import("./common/stylus/index.styl");

import lazyLoad from "vue-lazyload";

Vue.use(lazyLoad, {
  loading: require("./common/images/default.png")
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
