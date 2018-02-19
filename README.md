# 仿QQ音乐 WebApp
## 介绍

该项目来源[HuangYi](https://github.com/ustbhuangyi), 之前写过他的[eleApp](https://github.com/davidlin88/vue-ele),后来发现这个进阶项目-音乐 App,于是有了这个仓库

数据来源 QQ 音乐 `JSONP`，`Node` 代理部分接口


### 扫一扫手机预览 (微信右上角使用浏览器打开,网站被墙可访问备用地址)

<img src="./static/二维码.png" width="200px"/>

[二维码地址](https://davidlin88.github.io/vue-music/)

## 组件

* 基础组件：确认对话框，loading，进度条，搜索框，滚动组件
* 业务组件：歌单详情，播放内核，搜索页面，顶部导航，排行榜等组件
* 上拉刷新，函数节流搜索，消除点击延迟

## 已完成部分

* [x] /recommand 推荐页：轮播图，推荐歌单列表
* [x] /singer 歌手页列表：歌手列表展示，左右联动，快速入口，类似通讯录
* [x] /singer/:id 歌手详情页：局部滚动，视差，播放音乐，音乐播放器有的功能都有
* [x] /rank/:id 排行页：同上
* [x] /search 搜索：搜索结果，搜索历史，热门搜索，结果播放
* [ ] 播放列表页：当前播放队列
* [ ] ~~~用户中心页~~~

## 注意事项

* `animation-play-state: paused ios` 不支持[解决方案](https://codepen.io/HaoyCn/pen/BZZrLd)
* `vue@2.5+ ` [ios 不能播放问题](https://github.com/DDFE/DDFE-blog/issues/24)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 笔记(much)
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
### 数组的副本
```
let arr = [1, 2, 3]
let newArr = arr // 这样赋值不能创建新的数组,只是对原数组的引用
for(let i = 0 ; i < newArr.length ; i++) {
  newArr[i] += 1
}
console.log(newArr) // 2,3,4
console.log(arr) // 2,3,4
```
创建数组副本,用`let _arr = arr.slice()`
### $el的使用
使用`this.$ref.xxx`时,若取的对象是组件,而想取对应的根元素,就加个$el,即如`this.$refs.xxx.$el.style.bottom = '60px'`
### 解构对象的应用
```
 let {songlist, topinfo} = res // 解构: res有很多属性,提取特定属性,赋给其他变量
 let ret = {topinfo, songlist}
```
### ios系统测试svg图标位置误差(iphone se)
ios系统上测试时发现mini播放器播放图标的内外圈不对齐,将外容器添加`font-size: 0`解决
### ios系统audio不能播放的问题
降级vue版本 `vue`和`vue-template-complier`写死到2.3.3(package.json里去掉^),再`npm i`
### 搜索页跳歌手页动画难题
在搜索页新增路由,而不是跳到歌手路由的子路由,这样主页的动画和歌手动画就不会干扰了
### [Vue warn]Do not mutate vuex store state outside mutation handlers.
不要在mutations之外修改state数据,如直接将state内的数组赋值再修改,应在赋值语句末尾添加`slice()`以返回新的数组
### 单曲暂停切换歌词bug
原因: getlyric插件的seek(跳转)方法自带播放歌词
### 节流函数
```
export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      console.log(timer)
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
```
### 开始滚动时隐藏移动端的手机键盘
1. scroll设props,初始化方法里添加监听beforeScrollStart,并派发beforeScroll事件到suggest组件:
```
if (this.beforeScroll) {
  this.scroll.on('beforeScrollStart', () => {
    this.$emit('beforeScroll')
  })
}
```
2. suggest组件将beforeScroll事件传给search组件
```
<scroll @beforeScroll="listScroll"></scroll>

listScroll() {
      this.$emit('listScroll')
    },
```
3. search组件中触发search-box的input的blur事件(失去焦点以隐藏手机键盘)
```
<suggest @listScroll="blurInput">

blurInput() {
      this.$refs.searchBox.blur()
    },
```

### 移动端ios的input获取焦点页面会放大的解决方法
在index.html头部添加`<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">`

### ios端专辑封面动画不能暂停
transform叠加法:
```
// img:专辑图片 container:img的容器
_cdAnimation(container, img) {
  const cTransform = getComputedStyle(container).transform
  const iTransform = getComputedStyle(img).transform
  container.style[transform] = cTransform === 'none'
  ? iTransform
  : iTransform.concat(' ', cTransform)
  },
```
### 设置和读取缓存 Storage
1. 安装good-storage插件
2. 读与写:
```
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// compare:findindex传入的是function,所以不能直接传val
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val) // 插入到数组最前
  if (maxLen && arr.length > maxLen) {
    arr.pop() // 删除末位元素
  }
}

// 存储搜索历史
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 加载本地缓存的搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
```

### 模拟数据的简单应用
在取得真实数据后,从接口复制到本地的json文件,在api请求时then后是真实数据,catch中从本地json中获取模拟数据:
```
_getDiscList() {
  getDiscList()
    .then((res) => {
      if (res.code === ERR_OK) {
        this.discList = res.data.list
      }
    })
    .catch(() => {
      console.log('没,没有推荐,开始请求模拟数据...')
      setTimeout(() => {
        this.discList = require('../../../static/recommend.json').data.list
      }, 2000)
    })
},
```

### v-if和v-else的使用
```
<div v-if="currentLyric">
  <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="line.id">
    {{line.txt}}
  </p>
</div>
<div v-else> // v-else和v-if并列 else不用写条件
  <p class="text">暂无歌词</p>
</div>
```

### Unexpected token g in JSON at position 0
报错原因是json文件的应用方式有误,我遇到的问题原因是本地json文件格式有误,写成了`xxx: {xxx}`,应该是`{xxx}`

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
