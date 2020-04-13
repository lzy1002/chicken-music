import * as modes from "../common/js/modes.js";

import {loadSearchHistory} from "../common/js/cache.js";

export default {
  singer: {},
  playing: false,
  playMode: modes.sequence,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  fullScreen: false,
  disc: {},
  rank: {},
  searchHistory: loadSearchHistory()

}
