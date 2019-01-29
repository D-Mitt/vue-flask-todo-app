import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/store'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

Vue.config.productionTip = false
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
