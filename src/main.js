import Vue from 'vue'
import App from './App'
import router from './router/index'
import VueLazyLoad from 'vue-lazyload'
import fastclick from 'fastclick'
import store from './store'

import 'common/stylus/index.styl'

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('common/image/ff.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
