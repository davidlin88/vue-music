import {playMode} from 'common/js/config'

// 只存放最基础的数据
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [], // 播放列表
  sequenceList: [], // 播放清单
  mode: playMode.sequence, // 语义化
  currentIndex: -1 // 当前索引
}

export default state