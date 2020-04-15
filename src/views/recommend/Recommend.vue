<template>
  <div class="recommend-wrapper" ref="recommendWrapper">
    <scroll class="recommend-scroll" ref="recommendScroll" :data="discList">
      <div>
        <slider v-if="sliderData.length" ref="slider" :loop="loop" :auto-play="autoPlay">
          <div v-for="item in sliderData">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </slider>
        <div class="disc">
          <h3 class="title">热门歌单推荐</h3>
          <ul class="disc-list">
            <li class="disc-list-item" v-for="item in discList" @click="discItemClick(item)">
              <div class="img-box">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="content-box">
                <h3 class="name">{{item.creator.name}}</h3>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>

          <div class="loading-box" v-if="!discList.length">
            <loading></loading>
          </div>
        </div>
      </div>
    </scroll>

    <transition name="move">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Slider from "../../components/common/silder/Slider.vue";
  import Scroll from "../../components/common/scroll/Scroll.vue";
  import Loading from "../../components/common/loading/Loading.vue";

  import {ERR_OK} from "../../api/config.js";

  import {getSliderData, getDiscList} from "../../api/recommend.js";

  import {mapMutations} from "vuex";
  import {SET_DISC} from "../../store/mutations-types.js";

  import {Disc} from "../../common/js/disc.js";

  import {playerMixin} from "../../common/js/mixins.js";

  export default {
    name: "Recommend",
    mixins: [playerMixin],
    data() {
      return {
        loop: true,
        autoPlay: true,
        sliderData: [],
        discList: []
      }
    },
    created() {
      this._getSliderData();
      this._getDiscList();
    },
    activated() {
      window.setTimeout(_ => {
        if(this.autoPlay) {
          this.$refs.slider && this.$refs.slider.play();
        }
      }, 20);
    },
    deactivated() {
      if(this.autoPlay) {
        this.$refs.slider && this.$refs.slider.pause();
      }
    },
    methods: {
      _getSliderData() {
        getSliderData().then(res => {
          if(res.code === ERR_OK) {
            this.sliderData = res.data.slider;
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          if(res.data.code === ERR_OK) {
            this.discList = res.data.data.list;
          }
        })
      },
      discItemClick(discItem) {
        this.setDisc(new Disc(discItem));
        this.$router.push(`/recommend/${discItem.dissid}`);
      },
      handlePlayerBottom() {
        window.setTimeout(_ => {
          const bottom = this.playList.length > 0 ? 60 : 0;
          this.$refs.recommendWrapper.style.bottom = bottom + "px";
          this.$refs.recommendScroll.refresh();
        }, 20);
      },
      ...mapMutations({
        setDisc: SET_DISC
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .move-enter-active, .move-leave-active
    transition all 0.5s ease
  .move-enter, .move-leave-to
    transform translate3d(100%, 0, 0)

  .recommend-wrapper
    position fixed
    top 88px
    left 0
    right 0
    bottom 0
    overflow hidden
    .recommend-scroll
      width 100%
      height 100%
      .disc
        .title
          width 100%
          height 65px
          text-align center
          line-height 65px
          font-size $font-size-medium
          color $color-theme
        .disc-list
          .disc-list-item
            display flex
            padding 0 20px 20px 20px
            .img-box
              width 60px
              height 60px
              padding-right 20px
            .content-box
              flex 1
              display flex
              flex-direction column
              justify-content space-around
              font-size $font-size-medium
              .desc
                color $color-text-d
        .loading-box
          position absolute
          top 50%
          left 0
          width 100%
          transform translate3d(0, -50%, 0)

</style>