<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getDisc} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getDisc()
  },
  components: {
    MusicList
  },
  methods: {
    // 处理歌曲数据
    _normalizeSongs(list) {
      let ret = [] // 定义返回值
      list.forEach((item) => {
        if (item.songid && item.albummid) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    _getDisc() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getDisc(this.dissTid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        } else {
          console.log('没,没有歌曲')
        }
      })
    }
  },
  computed: {
    dissTid() {
      return this.disc.dissid
    },
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  }
}
</script>

<style lang="stylus">
.slide-enter-active, .slide-leave-active
  transition all .3s
.slide-enter, .slide-leave-to
  transform translate3d(100%,0,0)
</style>