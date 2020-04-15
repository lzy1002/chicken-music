<template>
  <div class="singer-detail-wrapper">
    <music-list :data="singer" :list="songList"></music-list>
  </div>
</template>

<script>
  import MusicList from "../../components/content/music-list/MusicList.vue";

  import {singer} from "../../store/getters.js";
  import {mapGetters} from "vuex";

  import {getSingerDetail} from "../../api/singer.js";
  import {getMusicSource} from "../../api/song.js";

  import {createSong} from "../../common/js/song.js";

  import {ERR_OK} from "../../api/config.js";

  export default {
    name: "SingerDetail",
    created() {
      if(!this.singer.mid) {
        this.$router.back();
        return;
      }
      this._getSingerDetail();
    },
    data() {
      return {
        songList: []
      }
    },
    methods: {
      _getSingerDetail() {
        getSingerDetail(this.singer.mid).then(res => {
          if(res.code === ERR_OK) {
            let songs = this._normalizeSongs(res.data.list);
            this._getMusicSource(songs);
          }
        })
      },
      _normalizeSongs(songs) {
        let ret = [];
        songs.forEach(item => {
          if(item.musicData.songmid && item.musicData.albummid) {
            ret.push(createSong(item.musicData));
          }
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
        "singer"
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .singer-detail-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    overflow hidden
    background-color $color-background
    z-index 999
</style>