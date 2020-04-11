<template>
  <div class="rank-wrapper" ref="rankWrapper">
    <scroll class="rank-scroll" :data="rankList" ref="rankScroll">
      <ul class="rank-box">
        <li class="rank-item" v-for="item in rankList" @click="rankItemClick(item)">
          <div class="img-box">
            <img :src="item.picUrl" alt="">
          </div>
          <div class="content">
            <p class="content-item" v-for="(song, index) in item.songList">
              <span class="num">{{index + 1}}</span>
              <span>{{songName(song)}}</span>
            </p>
          </div>
        </li>
      </ul>
    </scroll>

    <transition name="move">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Scroll from "../../components/common/scroll/Scroll.vue";

  import {getRankList} from "../../api/rank.js";
  import {ERR_OK} from "../../api/config.js";

  import {mapMutations} from "vuex";
  import {SET_RANK} from "../../store/mutations-types.js";

  import {Rank} from "../../common/js/rank.js";

  import {playerMixin} from "../../common/js/mixins.js";

  export default {
    name: "Rank",
    mixins: [playerMixin],
    data() {
      return {
        rankList: []
      }
    },
    created() {
      this._getRankList();
    },
    methods: {
      _getRankList() {
        getRankList().then(res => {
          console.log(res);
          if(res.code === ERR_OK) {
            this.rankList = res.data.topList;
          }
        })
      },
      songName({songname, singername}) {
        return `${songname}-${singername}`;
      },
      rankItemClick(rankItem) {
        this.setRank(new Rank(rankItem));
        this.$router.push(`/rank/${rankItem.id}`);
      },
      handlePlayerBottom() {
        window.setTimeout(_ => {
          const bottom = this.playList.length > 0 ? 60 : 0;
          this.$refs.rankWrapper.style.bottom = bottom + "px";
          this.$refs.rankScroll.refresh();
        }, 20);
      },
      ...mapMutations({
        setRank: SET_RANK
      })
    },
    components: {
      Scroll
    }

  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .move-enter-active, .move-leave-active
    transition all 0.5s ease
  .move-enter, .move-leave-to
    transform translate3d(100%, 0, 0)

  .rank-wrapper
    position fixed
    top 88px
    left 0
    right 0
    bottom 0
    overflow hidden
    .rank-scroll
      width 100%
      height 100%
      .rank-box
        padding-bottom 20px
        .rank-item
          display flex
          height 100px
          margin 0 20px
          padding-top 20px
          .img-box
            width 100px
            height 100px
            img
              width 100%
              height 100%
        .content
          flex 1
          display flex
          flex-direction column
          justify-content center
          height 100%
          padding 0 20px
          background-color $color-highlight-background
          .content-item
            height 26px
            line-height 26px
            font-size $font-size-small
            color $color-text-d
            no-wrap()
            overflow hidden
            .num
              margin-right 4px
</style>