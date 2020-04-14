import * as types from "./mutations-types";

export default {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING](state, flag) {
    state.playing = flag;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.playMode = mode;
  },
  [types.SET_PLAY_LIST](state, list) {
    state.playList = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc;
  },
  [types.SET_RANK](state, rank) {
    state.rank = rank;
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  },
  [types.SET_FAVORITE_LIST](state, favoriteList) {
    state.favoriteList = favoriteList;
  },
  [types.SET_LATELY_PLAY](state, latelyPlay) {
    state.latelyPlay = latelyPlay;
  }
}

