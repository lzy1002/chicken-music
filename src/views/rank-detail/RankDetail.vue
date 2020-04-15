<template>
  <div class="rank-detail-wrapper">
    <music-list :data="rank" :list="songList" :rankFlag="rankFlag"></music-list>
  </div>
</template>

<script>
  import MusicList from "../../components/content/music-list/MusicList.vue";

  import {getRankDetail} from "../../api/rank.js";
  import {getMusicSource} from "../../api/song.js";
  import {ERR_OK} from "../../api/config.js";

  import {createSong} from "../../common/js/song.js";

  import {mapGetters} from "vuex";

  export default {
    name: "RankDetail",
    data() {
      return {
        songList: [],
        rankFlag: true
      }
    },
    created() {
      if(!this.rank.id) {
        this.$router.back();
        return;
      }
      this._getRankDetail();
    },
    methods: {
      _getRankDetail() {
        getRankDetail(this.rank.id).then(res => {
          if(res.code === ERR_OK) {
            let songs = this._normalizeSongs(res.songlist);
            this._getMusicSource(songs);
          }
        })
      },
      _normalizeSongs(songs) {
        let ret = [];
        songs.forEach(song => {
          ret.push(createSong(song.data));
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
        "rank"
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .rank-detail-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    overflow hidden
    background-color $color-background

</style>