// 用gettter取数据到组件里,是数据的映射
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const disc = state => state.disc

export const rankItem = state => state.rankItem

// getter可充当计算属性
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
