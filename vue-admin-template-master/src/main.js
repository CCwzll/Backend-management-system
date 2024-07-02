import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control


if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
// 引入相关API接口函数,并挂在原型prototype上，类似全局组件，在所有组件中均可使用API相关接口
import API from '@/api'
// 引入全局组件 三级联动
import CateGorySelect from '@/components/CategorySelect'
// 组件实例的原型的原型指向为Vue.prototype
Vue.prototype.$API = API
// 注册全局组件
Vue.component(CateGorySelect.name, CateGorySelect)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
