import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import AsyncComputed from 'vue-async-computed'


import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  '@/components/global',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})

//voor async
//window.setImmediate = window.setTimeout

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
