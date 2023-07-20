import Toasted from 'vue-toasted';
import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';

axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');

Vue.use(Toasted);
