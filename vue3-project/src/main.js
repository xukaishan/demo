import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/js/calcFontSize'
import '@/assets/css/common.css'

Vue.use(ElementUI);
Vue.config.productionTip = false

window.vue = new Vue({
  render: h => h(App),
  router
}).$mount('#app')
