import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'

//将px转rem文件
import 'lib-flexible/flexible'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueCookies from 'vue-cookies'


//导入vant组件
import { 
  NavBar,
  Field,
  Button,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  Checkbox,
  SwipeCell,
  SubmitBar,
  List,
  Empty,
  AddressList,
  AddressEdit,
  Icon,
  Tab,
  Tabs,
  Uploader,
  Cell
} from 'vant'

//注册
Vue
  .use(NavBar)
  .use(Field)
  .use(Button)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Checkbox)
  .use(SwipeCell)
  .use(SubmitBar)
  .use(List)
  .use(Empty)
  .use(AddressList)
  .use(AddressEdit)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
  .use(Cell)


//请求之前执行, 请求拦截器
axios.interceptors.request.use(config => {

  // 

  if (config.method === 'post') {

    //序列化post请求参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }

    config.data = paramsString.slice(0, -1);

    // 

  }

  //必须返回config
  return config;

})

Vue.use(VueAxios, axios)

Vue.use(VueCookies)

Vue.config.productionTip = false

//将请求路径和appkey存放在原型属性里
Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002'
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='


//定义全局过滤器
Vue.filter('formatDate', (data, format) => {
  //data: 需要进行格式化的数据
  //format: 格式
  // 
  // 

  let date = new Date(data);
  // 

  //获取年份
  let year = date.getFullYear().toString();
  // 

  if (/(y+)/.test(format)) {
    // 
    //获取匹配组的内容
    let yearContent = RegExp.$1;
    // 

    format = format.replace(yearContent, year.slice(year.length - yearContent.length));
  }

  //替换月日时分秒
  let dateObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in dateObject) {
    //生成动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // 
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // 

      format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
    }
  }

  return format;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
