<template>
  <transition name="move">
    <div class="add-list-wrapper" v-show="showFlag" @click.stop>
      <div class="add-list-header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <search-box ref="searchBox" :placeholder="placeholder" @search="search"></search-box>
      <div class="list-box">
        <div class="shortcut">
          <switches :titles="titles" @select="changeSection"></switches>
        </div>
        <div class="lately" v-show="toggleFlag === 'lately'">
          <scroll class="lately-scroll" ref="latelyScroll" :data="formatLatelyPlay">
            <div class="content">
              <song-list :songList="formatLatelyPlay" @select="selectSong"></song-list>
            </div>
          </scroll>
        </div>
        <div class="history" v-show="toggleFlag === 'history'">
          <scroll class="history-scroll" ref="historyScroll" :data="searchHistory">
            <div class="content">
              <history-list :searchHistory="searchHistory" @searchItem="searchItem"></history-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="suggest-box" v-show="searchKey">
        <suggest :zhida="zhida" :search-val="searchKey"></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from "../../common/scroll/Scroll.vue";
  import SearchBox from "../../common/search-box/SearchBox.vue";
  import Switches from "../../common/switches/Switches.vue";
  import SongList from "../../content/song-list/SongList.vue";
  import HistoryList from "../../content/history-list/HistoryList.vue";
  import Suggest from "../../content/suggest/Suggest.vue";

  import {Song} from "../../../common/js/song.js";

  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "AddList",
    data() {
      return {
        showFlag: false,
        placeholder: "请搜索歌曲",
        titles: [{key: "lately", text: "最近播放"}, {key: "history", text: "搜索历史"}],
        toggleFlag: "lately",
        searchKey: "",
        zhida: false
      }
    },
    mounted() {
      window.setTimeout(_ => {
        if(this.toggleFlag === "lately") {
          this.$refs.latelyScroll.refresh();
        }else {
          this.$refs.historyScroll.refresh();
        }
      }, 20);
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      changeSection(flag) {
        this.toggleFlag = flag;
      },
      selectSong(song) {
        this.insertSong({song});
      },
      search(searchKey) {
        this.searchKey = searchKey;
      },
      searchItem(searchKey) {
        this.$refs.searchBox.set(searchKey);
      },
      ...mapActions([
        "insertSong"
      ])
    },
    computed: {
      formatLatelyPlay() {
        return this.latelyPlay.map(item => {
          let song = new Song(item);
          song.url = item.url;
          return song;
        });
      },
      ...mapGetters([
        "latelyPlay",
        "searchHistory"
      ])
    },
    watch: {
      toggleFlag(newVal) {
        window.setTimeout(_ => {
          if(newVal === "lately") {
            this.$refs.latelyScroll.refresh();
          }else {
            this.$refs.historyScroll.refresh();
          }
        }, 20);
      }
    },
    components: {
      Scroll,
      SearchBox,
      Switches,
      SongList,
      HistoryList,
      Suggest
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .move-enter-active, .move-leave-active
    transition all 0.5s ease
  .move-enter, .move-leave-to
    transform translate3d(100%, 0, 0)

  .add-list-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    overflow hidden
    background-color $color-background
    .add-list-header
      height 44px
      .title
        height 44px
        line-height 44px
        text-align center
        font-size $font-size-large
      .close
        position absolute
        top 0
        right 8px
        color $color-theme
        .icon-close
          display block
          padding 12px
          font-size 20px
    .list-box
      position absolute
      top 124px
      left 0
      right 0
      bottom 0
      .lately
        position absolute
        top 38px
        left 0
        right 0
        bottom 0
        .lately-scroll
          width 100%
          height 100%
          overflow hidden
      .history
        position absolute
        top 38px
        left 0
        right 0
        bottom 0
        .history-scroll
          width 100%
          height 100%
          overflow hidden
          .content
            padding 20px 30px
    .suggest-box
      position absolute
      top 124px
      left 0
      right 0
      bottom 0
      background-color $color-background

</style>