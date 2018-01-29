<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._trigglePercent()
    },
    progressClick(e) {
      this._offset(e.offsetX - progressBtnWidth / 2 + 1)
      this._trigglePercent()
    },
    _trigglePercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      let percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    // 封装进度条移动函数
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        // 进度条变化
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable'

  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background-color rgba(0,0,0,.3)
      .progress
        position absolute
        height 100%
        background-color $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text-w
          border-radius 50%
          background-color $color-theme
</style>