<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default{
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
      this._initDots()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth(isResize) {
      // 取轮播组的子元素
      this.children = this.$refs.sliderGroup.children

      let width = 0
      // 取轮播组件宽度(即屏幕宽度)
      let sliderWidth = this.$refs.slider.clientWidth
      for (var i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        // 设置轮播子图宽度为屏幕宽度
        child.style.width = sliderWidth + 'px'
        // 将轮播子图累加
        width += sliderWidth
      }

      // 增加2个slider宽度,为无缝滚动服务
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // 惯性
        snap: {
          loop: this.loop, // 循环
          threshold: 0.3, // // 滚动距离超过宽度/高度的 30% 时切换图片
          speed: 400 // 轮播间隔
        },
        click: true
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        // bs老版本有,新版本去掉
        // if (this.loop) {
        //   pageIndex -= 1
        // }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots() {
      // this.dots = new Array(this.children.length)
      this.dots = new Array(this.children.length - 2)
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next(400)
      }, this.interval)
    }
  },
  // 什么时候会destroyed?
  destroyed() {
    console.log('destroyed --> 清理定时器')
    clearTimeout(this.timer) // 有利于内存的释放
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable'

.slider
  min-height 1px
  position relative
  .slider-group
    overflow hidden
    white-space nowrap
    .slider-item
      float left
      box-sizing border-box
      overflow hidden
      text-align center
      a
        display block
        width 100%
        overflow hidden
        text-decoration none
      img
        display block
        width 100%
  .dots
    position absolute
    right 0
    left 0
    bottom 12px
    text-align center
    font-size 0
    .dot
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 4px
      background-color $color-d
      &.active
        width 20px
        border-radius 5px
        background-color $color-d-a
</style>