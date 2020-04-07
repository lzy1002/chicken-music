import * as types from "./mutations-types.js";
import * as modes from "../common/js/modes.js";

export const addSongList = ({commit}, {list, index}) => {
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_MODE, modes.sequence);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);
};
