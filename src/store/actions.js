import * as types from "./mutations-types.js";
import * as modes from "../common/js/modes.js";

import {shuffle} from "../common/js/utils.js";

import {addHistory, clearHistory, removeHistory} from "../common/js/cache.js";

function findSongIndex(list, fn) {
  return list.findIndex(fn);
}

export const addSongList = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list);
  if(state.playMode === modes.random) {
    const randomList = shuffle([...list]);
    commit(types.SET_PLAY_LIST, randomList);
    commit(types.SET_CURRENT_INDEX, findSongIndex(randomList, song => song === list[index]));
  }else {
    commit(types.SET_PLAY_LIST, list);
    commit(types.SET_CURRENT_INDEX, index);
  }
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);
};

export const modeChange = ({commit, state}, {list, currentSong}) => {
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_CURRENT_INDEX, findSongIndex(list, song => song === currentSong));
};

export const addRandomList = ({commit}, {list}) => {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_LIST, shuffle([...list]));
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_PLAY_MODE, modes.random);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);
};

export const insertSong = ({commit, state}, {song}) => {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentSong = state.playList[state.currentIndex];
  let currentIndex = state.currentIndex + 1;

  let index = findSongIndex(playList, item => item.songid === song.songid);

  playList.splice(currentIndex, 0, song);

  if(index > -1) {
    if(index >= currentIndex) {
      playList.splice(index + 1, 1);
    }else {
      playList.splice(index, 1);
      currentIndex -= 1;
    }
  }

  let sequenceCurrentIndex = findSongIndex(sequenceList, item => item.songid === currentSong.songid) + 1;
  let sequenceIndex = findSongIndex(sequenceList, item => item.songid === song.songid);

  sequenceList.splice(sequenceCurrentIndex, 0, song);

  if(sequenceIndex > -1) {
    if(sequenceIndex >= sequenceCurrentIndex) {
      sequenceList.splice(sequenceIndex + 1, 1);
    }else {
      sequenceList.splice(sequenceIndex, 1);
    }
  }

  commit(types.SET_PLAY_LIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);

};

export const addSearchHistory = ({commit}, {history}) => {
  commit(types.SET_SEARCH_HISTORY, addHistory(history));
};

export const clearSearchHistory = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearHistory());
};

export const removeSearchHistory = ({commit}, {history}) => {
  commit(types.SET_SEARCH_HISTORY, removeHistory(history));
};
