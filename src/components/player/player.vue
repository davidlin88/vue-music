<template>
  <div class="player" v-show="playlist.length > 0">
    <!-- 常规播放器 -->
    <transition
    name="normal"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 高斯模糊背景 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <!-- 专辑封面 -->
        <div class="middle"
        @touchstart.prevent="middleTouchStart"
        @touchmove.prevent="middleTouchMove"
        @touchend="middleTouchEnd"
        ref="cd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="image" :src="currentSong.image" ref="img">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词 -->
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                class="text"
                ref="lyricLine"
                v-for="(line, index) in currentLyric.lines"
                :key="index"
                :class="{'current' : currentLineNum === index}">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active' : currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active' : currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time tiem-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBaChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 迷你播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img height="40" width="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini"  @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- canplay/error/timeupdate都是h5 audio自带的事件 -->
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
// 一个用js写css动画的插件
import animations from 'create-keyframe-animation'
import {prefixStyle, addClass} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser' // 歌词解析插件
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data() {
    return {
      songReady: false, // 阻止切换过快曲目而报错
      currentTime: 0,
      radius: 30,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : this.mode === playMode.random ? 'icon-random' : ''
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created() {
    this.touch = {}
  },
  methods: {
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        // Lyric自带的跳转,没参数时跳到开头
        this.currentLyric.seek(0)
      }
      if (!this.playling) {
        this.setPlayingState(true)
      }
    },
    next() {
      // 歌曲未ready,则返回
      if (!this.songReady) {
        return
      }
      // 防止因曲目只有一首造成bug
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length - 1) {
          index = 0
        }
        this.setCurrentIndex(index)
        // 若为暂停状态,设为播放状态
        if (!this.playing) {
          this.togglePlaying()
        }
      }

      this.songReady = false
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    // 出现钩子 --> 进入动画
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        // 开始位置 --> 迷你播放器专辑图片
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        // 回弹
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      // 动画注册
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400, // 动画时间
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      // 取消动画注册
      animations.unregisterAnimation('move')
      // 清空动画
      this.$refs.cdWrapper.style.animation = ''
    },
    // 离开钩子 --> 消失动画
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all .4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    open() {
      this.setFullScreen(true)
    },
    back() {
      // this.fullScreen = false
      // 直接修改是没用的,要在vuex中修改
      this.setFullScreen(false)
    },
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        // Lyric自带的方法
        this.currentLyric.togglePlay()
      }
    },
    ready() {
      this.songReady = true
    },
    error() {
      this.songReady = true
    },
    updateTime(e) {
      // currentTime是audio当前播放的时间,是个可读写属性
      this.currentTime = e.target.currentTime
    },
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    onProgressBaChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying(true)
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      if (txt) {
        this.playingLyric = txt
      } else {
        this.playingLyric = '暂无歌词'
      }
    },
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.max(-window.innerWidth, left + deltaX)
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd() {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch) {}
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 给秒数补0
    _pad(num, n = 2) {
      // 转为字符串,取长度
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    _toggleplay(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
      if (!this.playing) {
        this._cdAnimation(this.$refs.cdWrapper, this.$refs.img)
        this.$refs.img.classList.remove('play')
      } else {
        addClass(this.$refs.img, 'play')
      }
    },
    _cdAnimation(container, img) {
      const cTransform = getComputedStyle(container).transform
      const iTransform = getComputedStyle(img).transform
      container.style[transform] = cTransform === 'none'
        ? iTransform
        : iTransform.concat(' ', cTransform)
    },
    // 映射mutations的方法
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      // 防止暂停状态下切换播放模式导致歌曲自动播放
      if (newSong.id === oldSong.id) {
        return
      }
      // 调用Lyric插件自带的清理方法
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        // html5 audio 标签自带的方法
        this.$refs.audio.play()
        this.getLyric()
      })
      // 防止微信后台bug
      // setTimeout(() => {
      //   // html5 audio 标签自带的方法
      //   this.$refs.audio.play()
      //   this.getLyric()
      // }, 1000)
    },
    playing(newPlaying) {
      this._toggleplay(newPlaying)
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .player
    .normal-player
      position fixed
      left 0
      right 0
      bottom 0
      top 0
      z-index 150
      background-color $color-background-m
      .background
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        z-index -1
        opacity .6
        filter blur(20px)
      .top
        position relative
        margin-bottom 25px
        .back
          position absolute
          top 0
          left 6px
          z-index 50
          .icon-back
            display block
            padding 9px
            font-size $font-size-large-x
            color $color-theme
            transform rotate(-90deg)
        .title
          width 70%
          margin 0 auto
          line-height 40px
          text-align center
          no-wrap()
          font-size $font-size-large
          color $color-text-w
        .subtitle
          line-height 20px
          text-align center
          font-size $font-size-medium
          color $color-text-w
      .middle
        position fixed
        width 100%
        top 80px
        bottom 170px
        white-space nowrap
        font-size 0
        .middle-l
          display inline-block
          vertical-align top
          position relative
          width 100%
          height 0
          padding-top 80%
          .cd-wrapper
            position absolute
            left 10%
            top 0
            width 80%
            height 100%
            .cd
              width 100%
              height 100%
              box-sizing border-box
              border 10px solid rgba(255,255,255,.1)
              border-radius 50%
              .play
                animation rotate 20s linear infinite
              // &.pause
              //   animation-play-state paused // 暂停正在播放的动画
              .image
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                border-radius 50%
          .playing-lyric-wrapper
            width 80%
            margin 30px auto 0 auto
            overflow hidden
            text-align center
            .playing-lyric
              height 20px
              line-height 20px
              font-size $font-size-medium
              color $color-text-w
        .middle-r
          display inline-block
          vertical-align top
          width 100%
          height 100%
          overflow hidden
          .lyric-wrapper
            width 80%
            margin 0 auto
            overflow hidden
            text-align center
            .text
              line-height 32px
              color $color-d
              font-size $font-size-medium
              &.current
                color $color-text-w

      .bottom
        position absolute
        bottom 50px
        width 100%
        .dot-wrapper
          text-align center
          font-size 0
          .dot
            display inline-block
            vertical-align middle
            margin 0 4px
            width 8px
            height 8px
            border-radius 50%
            background-color $color-d
            &.active
              width 20px
              border-radius 5px
              background-color $color-d-a
        .progress-wrapper
          display flex
          align-items center
          width 80%
          margin 0 auto
          padding 10px 0
          .time
            color $color-text-w
            font-size $font-size-small
            flex 0 0 30px
            width 30px
            &.time-l
              text-align left
            &.time-r
              text-align right
          .progress-bar-wrapper
            flex 1
        .operators
          display flex
          .icon
            flex 1
            color $color-theme
            &.disable
              color $color-theme-d
            i
              font-size 30px
          .i-left
            text-align right
          .i-center
            padding 0 20px
            text-align center
            i
              font-size 40px
          .i-right
            text-align left
          .icon-favorite
            color $color-sub-theme
      // 酷炫的动画
      &.normal-enter-active, &.normal-leave-active
        transition all .4s
        .top, .bottom
          // 贝塞尔曲线 --> 实现回弹
          transition all .4s cubic-bezier(.86,.18,.82,1.32)
      &.normal-enter, &.normal-leave-to
        opacity 0
        // 上部从上往下移
        .top
          transform translate3d(0,-100px,0)
        // 下部从下往上移
        .bottom
          transform translate3d(0,100px,0)
    .mini-player
      display flex
      align-items center
      position fixed
      left 0
      bottom 0
      z-index 180
      width 100%
      height 60px
      background-color $color-background
      &.mini-enter-active, &.mini-leave-active
        transition all .4s
      &.mini-enter, &.mini-leave-to
        opacity 0
      .icon
        flex 0 0 40px
        width 40px
        padding 0 10px 0 20px
        img
          border-radius 50%
          // transform叠加会莫名偏移,所以去除
          // &.play
          //   animation rotate 10s linear infinite
          // &.pause
          //   animation-play-state paused
      .text
        display flex
        flex-direction column
        justify-content center
        flex 1
        line-height 20px
        overflow hidden
        .name
          margin-bottom 2px
          no-wrap()
          font-size $font-size-medium
          color $color-text
        .desc
          no-wrap()
          font-size $font-size-small
          color $color-text-g
      .control
        flex 0 0 30px
        width 30px
        padding 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size 30px
          color $color-theme
        .icon-mini
          font-size 30px
          position absolute
          left 0px
          top 0px

  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>