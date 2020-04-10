import {mapGetters} from "vuex";

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
