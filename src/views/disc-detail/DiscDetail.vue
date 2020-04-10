<template>
  <div class="disc-detail-wrapper">
    <music-list :data="disc" :list="songList"></music-list>
  </div>
</template>

<script>
  import MusicList from "../../components/content/music-list/MusicList.vue";

  import {getDiscDetail} from "../../api/recommend.js";
  import {getMusicSource} from "../../api/song.js";

  import {createSong} from "../../common/js/song.js";

  import {ERR_OK} from "../../api/config.js";

  import {mapGetters} from "vuex";

  export default {
    name: "DiscDetail",
    data() {
      return {
        songList: []
      }
    },
    created() {
      if(!this.disc.id) {
        this.$router.back();
        return;
      }
      this._getDiscDetail();
    },
    methods: {
      _getDiscDetail() {
        getDiscDetail(this.disc.id).then(res => {
          if(res.data.code === ERR_OK) {
            let songs = this._normalizeSongs(res.data.cdlist[0].songlist);
            this._getMusicSource(songs);

          }
        })
      },
      _normalizeSongs(songs) {
        let ret = [];
        songs.forEach(song => {
          ret.push(createSong(song));
        });

        return ret;
      },
      _getMusicSource(songs) {
        getMusicSource(songs).then(res => {
          this.songList = res;
        })
      }
    },
    computed: {
      ...mapGetters([
        "disc"
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .disc-detail-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    overflow hidden
    background-color $color-background
</style>