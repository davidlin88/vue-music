### fastlick插件
用于解决移动端300ms点击延迟的问题,用法:main.js中引入使用:
```
import fastclick from 'fastclick'

fastclick.attach(document.body)
```
### 绝对路径的使用
在build文件夹下修改webpack.base.conf.js下的alias:
```
alias: {
  // code
  'common': resolve('src/common'),
  'components': resolve('src/components')
}
```
在样式中引用要加波浪号:`~import '~common/stylus/mixin'`
### 报错:Error in render: "TypeError: Cannot read property 'matched' of undefined"
```
import router from './router/index'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, // 不能用大写,会报错.??
  render: h => h(App)
})
```
### 阻止点击事件冒泡
`@click.stop="clickEvent"`
### router-link的类
router-link跳转后,点击的链接会激活一个名为`.router-link-active`的类,可借此进行css设计
### encodeURIComponent() 
把字符串符串作为 URI 组件进行编码,忽略ASCII字母数字和标点- _ . ! ~ * ' ( )
### 查看QQ音乐的JSONP的URL接口
审查元素-network-JS或XHR-含fcg的项目-URL从开头至.fcg结束
### keep-alive
包裹router-view,可将dom缓存在内存中,不会每次切换都加载
### 5xx的错误
5开头都是服务端的错误
### 一个better-scroll的巨坑
1.x版本不能无缝滚动,降到0.1.15就ok,暂不知原因
### 抽象组件scroll
scroll组件的外层元素宽高应依据浏览器窗口进行定位(默认被内部元素撑开则无法滚动):
```
.recommend-content
  positon fixed
  top 88px
  left 0
  right 0
  bottom 0
```
### scroll滚不到底的坑
创建和refreshBS对象时,使用`this.$nextTick`包裹,可预防因异步加载导致的BS高度计算误差而引起的滚不到底的情况(用settimeout时)
### user-select: none
设定后,用户不能选中文本
### 图片懒加载(提速,省流)
1. 安装:`cnpm i vue-lazyload`
2. main.js中引入并使用:
```
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: require('common/image/ff.png') // 替代预览的图片
  })
```
3. 组件中调用:`<img v-lazy="item.url"> // 原为:src="item.url"`

### 控制loading组件的显隐
用`v-show="!discList.length"`而非`v-show="!discList"`,因data中定义了discList,即使是无元素,也不是undefined
### 在父组件中执行子组件的事件
可直接通过形如`this.$refs.listview.refresh()`调用
### vue-router的编程跳转(动态的变量路由地址)
```
this.$router.push({
  path: `/singer/${singer.id}`
})
```
### CSS3 animation动画的暂停
```
div {
  animation-play-state: paused;
  -webkit-animation-play-state: paused; /* Safari 和 Chrome */
} // 动画的css代码要同时赋予
```
### svg circle 图形
```
// viewbox 视口的区域 0,0到100,100
<svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
  // r:半径 cx/cy:圆心坐标
  <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
  // stoke-dasharray:描边距离(总长) stroke-dashoffset:描边偏移(显示长度)
  <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" stroke-dasharray="100" />
</svg>
```

### vue2.x 通过后端接口代理从api获取数据
1. `webpack.dev.conf.js`中创建接口:
```
// 开头调用:
var express = require('express')
var axios = require('axios')
var app = express()
var apiRoutes = express.Router()
app.use('/api', apiRoutes)

// devServer的最后添加:
    before(app) {
      app.get('/api/getDiscList', function (req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg' // 原api
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
    }
```
2. api的js文件中,将url换成步骤1中自定义的接口,通过axios获取返回数据
```
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq', // 加引号
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
```
3. 组件中通过api的js文件中的方法获取数据
```
import {getDiscList} from 'api/recommend'

_getDiscList() {
  getDiscList().then((res) => {
    if (res.code === ERR_OK) {
      console.log('推荐:', res)
      this.discList = res.data.list
    } else {
      console.log('没,没有推荐')
    }
  })
}
```