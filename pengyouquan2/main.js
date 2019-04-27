import Vue from 'vue'
import App from './App'
import store from './store'

import Protobuf from './static/protobuf-2.3.4.min.js'
import RongIMLib from './static/RongIMLib-2.4.0.js'

RongIMLib.RongIMClient.Protobuf = Protobuf
Vue.prototype.$store = store;
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store, 
	...App
})





app.$mount()