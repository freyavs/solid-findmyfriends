import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import AsyncComputed from 'vue-async-computed'

Vue.config.productionTip = false

Vue.use(AsyncComputed);

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    global.setImmediate()
  },
}).$mount('#app')
