import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import qs from 'qs'
// import devtools from '@vue/devtools'
//
// if (process.env.NODE_ENV === 'development') {
//   devtools.connect(/* host, port */)
// }

Vue.prototype.qs = qs;
Vue.prototype.axios = axios;
Vue.use(ElementUI);
Vue.config.productionTip = false

axios.defaults.withCredentials=true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
