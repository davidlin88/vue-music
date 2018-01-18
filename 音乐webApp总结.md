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
### router-link的类
router-link跳转后,点击的链接会激活一个名为`.router-link-active`的类,可借此进行css设计
### encodeURIComponent() 
把字符串符串作为 URI 组件进行编码,忽略ASCII字母数字和标点- _ . ! ~ * ' ( )
### 查看QQ音乐的JSONP的URL接口
审查元素-network-JS或XHR-含fcg的项目-URL从开头至.fcg结束