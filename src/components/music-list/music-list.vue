<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 蒙版 -->
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" class="list" ref="list" :probe-type="probeType" :listen-scroll="listenScroll">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {prefixStyle} from 'common/js/dom'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin], // 插入mixin
  props: {
    rank: {
      type: Boolean,
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted() {
    // 动态获取歌曲列表的top
    // this.$refs.list取得的是vue-component对象,取dom元素要加$el
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  data() {
    return {
      scrollY: 0
    }
  },
  watch: {
    scrollY(newY) {
      // 控制layer层移动距离不超过图片高度
      // 是否可以将layer高度变为歌曲列表高度达到这个效果(性能?)
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1 // 放大
      let blur = 0 // 高斯模糊
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      // 上拉放大歌手图
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 下拉隐藏歌手图
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style['display'] = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style['display'] = 'block'
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  methods: {
    // 处理有迷你播放器时,scroll高度不全的情况
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      // vue-router的方法
      this.$router.back()
    },
    // 调用actions的方法
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .music-list
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background-color $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .title
      position absolute
      top 0
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text-w
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70% // 宽高比10:7
      transform-origin top // 元素基点位置
      background-size cover
      .play-wrapper
        position absolute
        bottom 20px
        z-index 50
        width 100%
        .play
          box-sizing border-box
          width 135px
          padding 7px 0
          margin 0 auto
          text-align center
          border 1px solid $color-theme
          color $color-theme
          border-radius 100px
          font-size 0
          .icon-play
            display inline-block
            vertical-align middle
            margin-right 6px
            font-size $font-size-medium-x
          .text
            display inline-block
            vertical-align middle
            font-size $font-size-small
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background-color rgba(7,17,27,.4)
    .bg-layer
      position relative
      height 100%
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      background-color $color-background-g
      .song-list-wrapper
        padding 20px 30px
        background-color $color-background-g
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>