<template>
  <transition name="move">
    <div class="user-wrapper">
      <div class="user-header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <switches :titles="titles" @select="selectSwitch"></switches>
      </div>
      <div class="play-btn-box">
        <div class="play-btn" @click="randomPlayAll">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="section-box" ref="sectionBox">
        <div class="favorite-box" ref="favoriteBox" v-show="sectionFlag === 'favorite'">
          <scroll class="favorite-scroll" ref="favoriteScroll" :data="formatFavoriteList">
            <div class="content">
              <song-list :song-list="formatFavoriteList" @select="selectSong"></song-list>
            </div>
          </scroll>
        </div>
        <div class="lately-box" ref="latelyBox" v-show="sectionFlag === 'lately'">
          <scroll class="lately-scroll" ref="latelyScroll" :data="formatLatelyPlay">
            <div class="content">
              <song-list :song-list="formatLatelyPlay" @select="selectSong"></song-list>
            </div>
          </scroll>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from "../../components/common/switches/Switches.vue";
  import Scroll from "../../components/common/scroll/Scroll.vue";
  import SongList from "../../components/content/song-list/SongList.vue";

  import {Song} from "../../common/js/song.js";
  import {playerMixin} from "../../common/js/mixins.js";

  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "User",
    mixins: [playerMixin],
    data() {
      return {
        titles: [{key: "favorite", text: "我喜欢的"}, {key: "lately", text: "最近听的"}],
        sectionFlag: "favorite"
      }
    },
    methods: {
      back() {
        this.$router.back();
      },
      selectSong(song) {
        this.insertSong({song});
      },
      selectSwitch(key) {
        this.sectionFlag = key;
      },
      randomPlayAll() {
        if(this.sectionFlag === "favorite" && this.formatFavoriteList.length > 0) {
          this.addRandomList({list: this.formatFavoriteList});
        }else if(this.sectionFlag === "lately" && this.formatLatelyPlay.length > 0) {
          this.addRandomList({list: this.formatLatelyPlay});
        }
      },
      handlePlayerBottom() {
        window.setTimeout(_ => {
          const bottom = this.playList.length > 0 ? 60 : 0;
          this.$refs.sectionBox.style.bottom = bottom + "px";
          if(this.sectionFlag === "favorite") {
            this.$refs.favoriteScroll.refresh();
          }else {
            this.$refs.latelyScroll.refresh();
          }
        }, 20);
      },
      ...mapActions([
        "insertSong",
        "addRandomList"
      ])
    },
    computed: {
      formatFavoriteList() {
        return this.favoriteList.map(item => {
          let song = new Song(item);
          song.url = item.url;
          return song;
        });
      },
      formatLatelyPlay() {
        return this.latelyPlay.map(item => {
          let song = new Song(item);
          song.url = item.url;
          return song;
        });
      },
      ...mapGetters([
        "favoriteList",
        "latelyPlay"
      ])
    },
    watch: {
      sectionFlag(newVal) {
        window.setTimeout(_ => {
          if(newVal === "favorite") {
            this.$refs.favoriteScroll.refresh();
          }else {
            this.$refs.latelyScroll.refresh();
          }
        }, 20);
      }
    },
    components: {
      Switches,
      Scroll,
      SongList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .move-enter-active, .move-leave-active
    transition all 0.5s ease
  .move-enter, .move-leave-to
    transform translate3d(100%, 0, 0)

  .user-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    overflow hidden
    z-index 998
    background-color $color-background
    .user-header
      margin 10px 0 30px
      .back
        position absolute
        top 0
        left 6px
        font-size $font-size-large-x
        color $color-theme
        .icon-back
          display block
          padding 10px
    .play-btn-box
      .play-btn
        width 135px
        text-align center
        padding 7px 0
        border 1px solid $color-text-l
        color $color-text-l
        border-radius 100px
        margin 0 auto
        font-size 0
        .icon-play
          font-size $font-size-medium-x
          vertical-align middle
          margin-right 6px
        .text
          font-size $font-size-small
          vertical-align middle
    .section-box
      position absolute
      top 110px
      left 0
      right 0
      bottom 0
      .favorite-box
        width 100%
        height 100%
        overflow hidden
        .favorite-scroll
          width 100%
          height 100%
      .lately-box
        width 100%
        height 100%
        overflow hidden
        .lately-scroll
          width 100%
          height 100%

</style>