import {mapGetters, mapActions, mapMutations} from "vuex";
import {SET_PLAY_MODE} from "../../store/mutations-types.js";
import * as modes from "./modes.js";
import {shuffle} from "./utils.js";

export const playerMixin = {
  computed: {
    ...mapGetters([
      "playList"
    ])
  },
  mounted() {
    this.handlePlayerBottom();
  },
  activated() {
    this.handlePlayerBottom();
  },
  watch: {
    playList() {
      this.handlePlayerBottom();
    }
  },
  methods: {
    handlePlayerBottom() {
      throw new Error("Please write the function handlePlayerBottom");
    }
  }

};

export const modeMixin = {
  methods: {
    changeMode() {
      let mode = this.playMode + 1;
      mode = mode % 3;
      this.setPlayMode(mode);
      if(mode === modes.random) {
        const randomList = shuffle(this.sequenceList);
        this.modeChange({list: randomList, currentSong: this.currentSong});
      }else if(mode === modes.sequence) {
        this.modeChange({list: this.sequenceList, currentSong: this.currentSong});
      }

    },
    ...mapActions([
      "modeChange"
    ]),
    ...mapMutations({
      setPlayMode: SET_PLAY_MODE
    })
  },
  computed: {
    modeIcon() {
      return this.playMode === modes.sequence ? "icon-sequence" : this.playMode === modes.loop ? "icon-loop" : "icon-random";
    },
    ...mapGetters([
      "sequenceList",
      "playMode"
    ])
  }

};
