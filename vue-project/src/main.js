// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from '@/store'
import App from './App'
import router from './router'
import Directives from '@/directives';
import {get,post} from './api/http'
import qs from 'qs'
import iView from 'iview';
import * as func from '../test/unit/func/func'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/common.css'; 
import './assets/css/mycomponent.css' 
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(ElementUI);
Vue.use(Directives);



Vue.prototype.$qs = qs;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$msg = func.msg;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
