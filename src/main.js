import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.component('tree-table', TreeTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// // http://timemeetyou.com:8889/api/private/v1/
Vue.prototype.$http = axios
// 路由拦截
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})

Vue.config.productionTip = false

function GetDate(originval) {
  //需要处理的时间
  const dt = new Date(originval * 1000)

  //年
  const y = dt.getFullYear()
  //月
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  //日
  const d = (dt.getDate() + '').padStart(2, '0')
  //时
  const hh = (dt.getHours() + '').padStart(2, '')
  //分
  const mm = (dt.getMinutes() + '').padStart(2, '')
  //秒
  const ss = (dt.getSeconds() + '').padStart(2, '')

  //返回时间格式  yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}
//应用于插值表达式中
Vue.filter('dateFormat', GetDate)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
