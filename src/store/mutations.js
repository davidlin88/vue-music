import * as types from './mutation-types'

const mutations = {
  // [方法名](参数1,参数2...){方法}
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default mutations