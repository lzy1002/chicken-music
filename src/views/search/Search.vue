<template>
  <div class="search-wrapper">
    <search-box :placeholder="placeholder" @search="search" ref="searchBox"></search-box>

    <div class="shortcut-box" v-show="!searchVal">
      <div class="shortcut">
        <div class="content">
          <div class="hot-box">
            <h1 class="title">热门搜索</h1>
            <ul class="hot">
              <li class="hot-item" v-for="item in hotList" @click="hotClick(item.k)">{{item.k}}</li>
            </ul>
          </div>

          <div class="history-box">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <div class="history-list-box">

            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-box" v-show="searchVal">
      <suggest :search-val="searchVal" @toSinger="toSinger"></suggest>
    </div>

    <transition name="move">
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>
  import SearchBox from "../../components/common/search-box/SearchBox.vue";
  import Suggest from "../../components/content/suggest/Suggest.vue";

  import {getHotData} from "../../api/search.js";
  import {ERR_OK} from "../../api/config.js";
  import {Singer} from "../../common/js/singer.js";

  import {mapMutations} from "vuex";
  import {SET_SINGER} from "../../store/mutations-types.js";

  export default {
    name: "Search",
    data() {
      return {
        hotList: [],
        placeholder: "搜索歌曲、歌手",
        searchVal: ""
      }
    },
    components: {
      SearchBox,
      Suggest
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
      toSinger(singer) {
        this.setSinger(new Singer({name: singer.name, mid: singer.mid}));
        this.$router.push(`/search/${singer.mid}`);
      },
      ...mapMutations({
        setSinger: SET_SINGER
      })
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