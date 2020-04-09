import * as types from "./mutations-types.js";
import * as modes from "../common/js/modes.js";

function findSongIndex(list, fn) {
  return list.findIndex(fn);
}

export const addSongList = ({commit}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_PLAY_MODE, modes.sequence);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);
};

export const modeChange = ({commit, state}, {list, currentSong}) => {
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_CURRENT_INDEX, findSongIndex(list, song => song === currentSong));
};
