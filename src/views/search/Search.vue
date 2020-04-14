<template>
  <div class="search-wrapper">
    <search-box :placeholder="placeholder" @search="search" ref="searchBox"></search-box>

    <div class="shortcut-box" ref="shortcutBox" v-show="!searchVal">
      <scroll class="shortcut" ref="shortcutScroll" :data="searchHistory">
        <div class="content">
          <div class="hot-box">
            <h1 class="title">热门搜索</h1>
            <ul class="hot">
              <li class="hot-item" v-for="item in hotList" @click="hotClick(item.k)">{{item.k}}</li>
            </ul>
          </div>

          <div class="history-box" v-show="showHistoryBox">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <div class="history-list-box">
              <history-list :search-history="searchHistory" @searchItem="searchItem"></history-list>
            </div>
          </div>
        </div>
      </scroll>
    </div>

    <div class="result-box" ref="resultBox" v-show="searchVal">
      <suggest ref="suggest" :search-val="searchVal"></suggest>
    </div>

    <confirm ref="confirm" :text="confirmText" :right="confirmRight" @rightClick="clearHistory"></confirm>

    <transition name="move">
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>
  import Scroll from "../../components/common/scroll/Scroll.vue";
  import SearchBox from "../../components/common/search-box/SearchBox.vue";
  import Confirm from "../../components/common/confirm/Confirm.vue";
  import Suggest from "../../components/content/suggest/Suggest.vue";
  import HistoryList from "../../components/content/history-list/HistoryList.vue";

  import {getHotData} from "../../api/search.js";
  import {ERR_OK} from "../../api/config.js";

  import {mapActions, mapGetters} from "vuex";

  import {playerMixin} from "../../common/js/mixins.js";

  export default {
    name: "Search",
    mixins: [playerMixin],
    data() {
      return {
        hotList: [],
        placeholder: "搜索歌曲、歌手",
        searchVal: "",
        confirmText: "清空搜索历史",
        confirmRight: "清空"
      }
    },
    components: {
      Scroll,
      SearchBox,
      Confirm,
      Suggest,
      HistoryList
    },
    created() {
      this._getHotData();
    },
    methods: {
      _getHotData() {
        getHotData().then(res => {
          if(res.code === ERR_OK) {
            this.hotList = res.data.hotkey.slice(0, 10);
            console.log(this.hotList);
          }
        })
      },
      search(searchVal) {  // search-box组件向外导出的事件 携带最新的搜索key
        this.searchVal = searchVal;
      },
      hotClick(key) {
        this.$refs.searchBox.set(key);
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      searchItem(key) {
        this.$refs.searchBox.set(key);
      },
      clearHistory() {
        this.clearSearchHistory();
      },
      handlePlayerBottom() {
        window.setTimeout(_ => {
          const bottom = this.playList.length > 0 ? 60 : 0;
          this.$refs.shortcutBox.style.bottom = bottom + "px";
          this.$refs.resultBox.style.bottom = bottom + "px";
          this.$refs.shortcutScroll.refresh();
          this.$refs.suggest.refresh();
        }, 20);
      },
      ...mapActions([
        "clearSearchHistory"
      ])
    },
    computed: {
      showHistoryBox() {
        return this.searchHistory.length > 0;
      },
      ...mapGetters([
        "searchHistory"
      ])
    },
    watch: {
      searchVal(newVal) {
        if(newVal === "") {
          window.setTimeout(_ => {
            this.$refs.shortcutScroll.refresh();
          }, 20);
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .move-enter-active, .move-leave-active
    transition all 0.5s ease
  .move-enter, .move-leave-to
    transform translate3d(100%, 0, 0)

  .search-wrapper
    position fixed
    top 88px
    left 0
    right 0
    bottom 0
    overflow hidden
    .shortcut-box
      position fixed
      top: 178px
      left 0
      right 0
      bottom 0
      .shortcut
        width 100%
        height 100%
        overflow hidden
        .content
          .hot-box
            font-size $font-size-medium
            color $color-text-d
            margin 0 20px 20px 20px
            .title
              color $color-text-l
              margin-bottom 20px
            .hot
              overflow hidden
              .hot-item
                float left
                padding 5px 10px
                margin 0 20px 10px 0
                border-radius 6px
                background-color $color-highlight-background
          .history-box
            margin 0 20px 20px 20px
            .title
              display flex
              align-items center
              height 40px
              font-size $font-size-medium
              color $color-text-l
              .text
                flex 1
              .clear
                height 14px
                color $color-text-d
                extend-click()
    .result-box
      position fixed
      top 178px
      left 0
      right 0
      bottom 0
      overflow hidden
</style>