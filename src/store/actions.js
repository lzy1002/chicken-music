import * as types from "./mutations-types.js";
import * as modes from "../common/js/modes.js";

import {shuffle} from "../common/js/utils.js";

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
