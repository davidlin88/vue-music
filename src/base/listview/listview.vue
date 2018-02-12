<template>
  <scroll
  class="listview"
  ref="listview"
  :listenScroll="listenScroll"
  @scroll="scroll"
  :probeType="probeType">
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
          class="list-group-item"
          v-for="(item, index) in group.items"
          :key="index"
          @click="selectItem(item)">
            <img v-lazy="item.avatar" class="avatar" width="100" height="100">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- touchstart是better-scroll封装好的事件 -->
    <div
    class="list-shortcut"
    @touchstart.stop.prevent="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li
        v-for="(item, index) in shortcutList"
        class="item"
        :key="index"
        :data-index="index"
        :class="{current:currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>

    <!-- 悬浮索引 -->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <!-- loading -->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  created() {
    // 为什么不写在data中? --> 因不需要getter和setter,提高性能
    this.touch = {} // 用于在touchstart和touchmove间传递参数
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3 // 实时派发scroll事件,swipe下同样
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1 // 悬浮索引title与滚动索引间距
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh()
    },
    // 向外部派发select事件,参数是被点击的item元素
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      // e.touches[0]是触摸的第一个点的位置
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      this.currentIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // y轴偏移
      // | 0 等同于 Math.floor,向下取整
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 封装的滚动方法
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 300) // 0是滚动时间
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (var i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    // 监听data变化,计算dom高度
    data() {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 滚动到顶部,newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (var i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i] // 滚动位置的上一个索引高度
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
      console.log('底部不够了', this.currentIndex)
    },
    diff(newVal) {
      // 间距小于title高度时,title高度同步变高
      let fixedTop = newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      // fixedTop不变时,跳出计算
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable'
  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background-color $color-background-g
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text
        background-color $color-background
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text
          font-size $font-size-medium
    .list-shortcut
      position absolute
      z-index 30
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      text-align center
      .item
        font-family Helvetica // ?
        padding 3px
        line-height 1
        color $color-text
        font-size $font-size-small
        &.current
          color $color-text-l
    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text
        background-color $color-background
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>