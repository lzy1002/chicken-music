<template>
  <div class="suggest-wrapper" ref="suggestWrapper">
    <scroll class="suggest-scroll" ref="suggestScroll" :data="resultArr" @pullUp="pullUp">
      <ul class="content">
        <li class="result-item" v-for="item in resultArr" @click="resultItemClick(item)">
          <div class="icon">
            <i :class="resultIcon(item)"></i>
          </div>
          <p class="text">{{resultText(item)}}</p>
        </li>
        <div class="loading-wrapper" v-show="moreFlag">
          <loading text=""></loading>
        </div>
      </ul>
    </scroll>
    <div class="no-result-box" v-show="showNoResult">
      <no-result></no-result>
    </div>
  </div>
</template>

<script>
  import Scroll from "../../common/scroll/Scroll.vue";
  import Loading from "../../common/loading/Loading.vue";
  import NoResult from "../../content/no-result/NoResult.vue";

  import {getResultData} from "../../../api/search.js";
  import {getMusicSource} from "../../../api/song.js";
  import {ERR_OK} from "../../../api/config.js";

  import {Singer} from "../../../common/js/singer.js";
  import {createSong} from "../../../common/js/song.js";

  import {playerMixin} from "../../../common/js/mixins.js";

  import {mapMutations, mapActions} from "vuex";
  import {SET_SINGER} from "../../../store/mutations-types.js";

  export default {
    name: "Suggest",
    mixins: [playerMixin],
    props: {
      searchVal: {
        type: String,
        default: ""
      },
      zhida: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        perpage: 20,
        totalNum: -1,
        resultArr: [],
        singerArr: [],
        songArr: [],
        moreFlag: true
      }
    },
    methods: {
      _getResultData() {
        getResultData(this.searchVal, this.page, this.perpage, this.zhida).then(res => {
          console.log(res);
          if(res.data.code === ERR_OK) {
            this._normalizeResult(res);
          }
        });
      },
      _normalizeResult(res) {
        this.totalNum = res.data.data.song.totalnum;
        if(res.data.data.zhida.type === 2) {
          let singerArr = [];
          const zhida = res.data.data.zhida;
          singerArr.push({...new Singer({name: zhida.singername, mid: zhida.singermid}), type: "singer"});
          this.singerArr = singerArr;
        }
        let songs = this._normalizeSongs(res.data.data.song.list);
        this._getMusicSource(songs);

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
          const songArr = this.songArr;
          songArr.push(...res);
          this.songArr = songArr;
          this.resultArr = this.singerArr.concat(this.songArr);
          this.page += 1;
          this._checkLoadMore(songs);
        })
      },
      _checkLoadMore(songs) {
        if(this.page * this.perpage >= this.totalNum && songs.length <= 0) {
          this.moreFlag = false;
        }
      },
      resultIcon(item) {
        if(item.type === "singer") {
          return "icon-mine";
        }
        return "icon-music";
      },
      resultText(item) {
        if(item.type === "singer") {
          return item.name;
        }
        return `${item.songname}-${item.singer}`;
      },
      pullUp() {
        if(!this.moreFlag) return;
        this._getResultData();
      },
      resultItemClick(item) {
        if(item.type === "singer") {
          this.setSinger(new Singer({name: item.name, mid: item.mid}));
          this.$router.push(`/search/${item.mid}`);
        }else {
          this.insertSong({song: item});
          this.addSearchHistory({history: this.searchVal});
        }
      },
      handlePlayerBottom() {
        window.setTimeout(_ => {
          const bottom = this.playList.length > 0 ? 60 : 0;
          this.$refs.suggestWrapper.style.bottom = bottom + "px";
          this.$refs.suggestScroll.refresh();
        }, 20);
      },
      ...mapMutations({
        setSinger: SET_SINGER
      }),
      ...mapActions([
        "insertSong",
        "addSearchHistory"
      ])
    },
    computed: {
      showNoResult() {
        return !this.moreFlag && this.resultArr.length <= 0;
      }
    },
    watch: {
      searchVal(newVal) {
        this.page = 1;
        this.totalNum = 0;
        this.songArr = [];
        this.singerArr = [];
        this.resultArr = [];
        this.moreFlag = true;
        if(newVal === "") return;
        this._getResultData();
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"
  @import "../../../common/stylus/mixin.styl"

  .suggest-wrapper
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    .suggest-scroll
      width 100%
      height 100%
      .content
        padding 0 30px
        font-size $font-size-medium
        color $color-text-d
        .result-item
          display flex
          padding-bottom 20px
          .icon
            flex 0 0 30px
            width 30px
            height 16px
          .text
            no-wrap()
    .no-result-box
      width 100%
      position absolute
      top 50%
      left 0
      transform translate3d(0, -50%, 0)

</style>