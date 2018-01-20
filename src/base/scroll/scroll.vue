<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  porps: {
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
    }
  },
  mounted() {
    // setTimeout(() => {
    //   console.log('创建BS对象')
    //   this._initScroll()
    // }, 20)
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
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
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