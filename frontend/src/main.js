import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/store'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import UndoPlugin from './undo-plugin/plugin.js'

Vue.config.productionTip = false
Vue.use(UndoPlugin)
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  VueBootstrapTypeahead,
  render: h => h(App)
})
