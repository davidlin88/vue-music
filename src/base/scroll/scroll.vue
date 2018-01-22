<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    // 是否让scroll监听滚动事件 --> 减少消耗
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log('创建bs对象')
      this._initScroll()
    })
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let me = this // 保留vue实例
        this.scroll.on('scroll', (pos) => {
          // 派发scroll事件
          me.$emit('scroll', pos) // 此处若用this,则会指向scroll
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
  // watch: {
  //   // data() {
  //   //   setTimeout(() => {
  //   //     this.refresh()
  //   //   }, 20)
  //   // }
  //   data () {
  //     this.$nextTick(() => {
  //       console.log('refresh bs对象')
  //       this.refresh()
  //     })
  //   }
  // }
}
</script>