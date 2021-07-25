import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import * as utils from './common/utils'
Vue.use(uView)
Vue.prototype.$utils = utils
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
