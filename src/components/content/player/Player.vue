<template>
  <div class="player-wrapper" v-show="playerIsShow">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img src="https://y.gtimg.cn/music/photo_new/T002R300x300M000000QgFcm0v8WaF.jpg?max_age=2592000" alt="">
        </div>

        <div class="top">
          <div class="hide" @click="hide">
            <i class="icon-back"></i>
          </div>
          <h1 class="song-name">意外</h1>
          <p class="singer-name">薛之谦</p>
        </div>

        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="normalCd">
              <div class="cd-box">
                <img src="https://y.gtimg.cn/music/photo_new/T002R300x300M000000QgFcm0v8WaF.jpg?max_age=2592000" alt="">
              </div>
            </div>
          </div>
          <!---->
        </div>

        <div class="bottom">
          <div class="progress-wrapper">
            <span class="now-t">0:00</span>
            <span class="total-t">0:00</span>
          </div>
          <div class="control-wrapper">
            <div class="left">
              <i class="icon-sequence"></i>
            </div>
            <div class="left">
              <i class="icon-prev"></i>
            </div>
            <div class="center">
              <i class="icon-play"></i>
            </div>
            <div class="right">
              <i class="icon-next"></i>
            </div>
            <div class="right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="show">
        <div class="mini-cd-box">
          <img src="https://y.gtimg.cn/music/photo_new/T002R300x300M000000QgFcm0v8WaF.jpg?max_age=2592000" ref="miniCd" alt="">
        </div>
        <div class="text">
          <h3 class="song-name">意外</h3>
          <p class="song-singer">薛之谦</p>
        </div>
        <div class="control">
          <i class="icon-play-mini"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import {SET_FULL_SCREEN} from "../../../store/mutations-types.js";

  import animations from "create-keyframe-animation";

  export default {
    name: "Player",
    methods: {
      hide() {
        this.setFullScreen(false);
      },
      show() {
        this.setFullScreen(true);
      },
      enter(el, done) {
        let {x, y, scale} = this._calculateMove();

        let animation = {
          0: {
            transform: `translate3d(${-x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        };

        animations.registerAnimation({
          name: "move",
          animation,
          presets: {
            duration: 400,
            easing: "linear"
          }
        });

        animations.runAnimation(this.$refs.normalCd, "move", done);

      },
      afterEnter() {
        animations.unregisterAnimation("move");
        this.$refs.normalCd.style.animation = "none";
      },
      leave(el, done) {
        let {x, y, scale} = this._calculateMove();

        this.$refs.normalCd.style.transition = "all 0.2s ease";
        this.$refs.normalCd.style.transform = `translate3d(${-x}px, ${y}px, 0) scale(${scale})`;

        this.$refs.normalCd.addEventListener("transitionend", done);
      },
      afterLeave() {
        this.$refs.normalCd.style.transition = "none";
        this.$refs.normalCd.style.transform = "none";
      },
      _calculateMove() {
        let miniCd = this.$refs.miniCd;
        let normalCd = this.$refs.normalCd;
        let scale = miniCd.clientWidth / normalCd.clientWidth;
        let leftMove = window.innerWidth / 2 - 40;
        let bottomMove = window.innerHeight - (normalCd.clientHeight / 2 + 80 + (60 / 2));

        return {
          scale: scale,
          x: leftMove,
          y: bottomMove
        }

      },
      ...mapMutations({
        setFullScreen: SET_FULL_SCREEN
      })
    },
    computed: {
      playerIsShow() {
        return this.playList.length > 0;
      },
      ...mapGetters([
        "playList",
        "fullScreen"
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .normal-enter-active, .normal-leave-active
    transition all 0.4s ease
    .top, .bottom
      transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  .normal-enter, .normal-leave-to
    opacity 0
    .top
      transform translate3d(0, -100%, 0)
    .bottom
      transform translate3d(0, 100%, 0)

  .mini-enter-active, .mini-leave-active
    transition all 0.4s ease
  .mini-enter, .mini-leave-active
    opacity 0

  .player-wrapper
    .normal-player
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      background-color $color-background
      z-index 999
      .background
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        filter blur(20px)
        opacity 0.6
        z-index 0
        img
          width 100%
          height 100%
          vertical-align middle
      .top
        position relative
        margin-bottom 25px
        .hide
          position absolute
          top 0
          left 6px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
          .icon-back
            display block
            padding 9px
        .song-name
          width 70%
          height 40px
          line-height 40px
          text-align center
          margin 0 auto
          font-size $font-size-large
        .singer-name
          text-align center
          font-size $font-size-medium
          line-height 20px
      .middle
        position fixed
        top 80px
        bottom 170px
        width 100%
        .middle-l
          position relative
          width 100%
          padding-bottom 80%
          text-align center
          box-sizing border-box
          .cd-wrapper
            height 100%
            width 80%
            margin 0 auto
            .cd-box
              height 100%
              width 100%
              border 10px solid rgba(255, 255, 255, 0.1)
              box-sizing border-box
              border-radius 50%
              overflow hidden
              img
                width 100%
                height 100%
      .bottom
        position absolute
        bottom 50px
        width 100%
        .progress-wrapper
          width 80%
          height 30px
          margin 0 auto
          .now-t, .total-t
            display inline-block
            height 30px
            line-height 30px
        .control-wrapper
          width 100%
          height 40px
          display flex
          align-items center
          div
            flex 1
            color $color-theme
          .left
            text-align right
            font-size 30px
          .center
            text-align center
            font-size 40px
            padding 0 20px
          .right
            text-align left
            font-size 30px
    .mini-player
      position fixed
      left 0
      right 0
      bottom 0
      height 60px
      background-color $color-highlight-background
      display flex
      align-items center
      z-index 999
      .mini-cd-box
        width 40px
        height 40px
        padding 0 10px 0 20px
        img
          width 100%
          border-radius 50%
      .text
        flex 1
        line-height 20px
        .song-name
          font-size $font-size-medium
        .song-singer
          font-size $font-size-small
          color $color-text-d
      .control
        font-size 32px
        color $color-theme-d
        padding 0 10px
        .icon-playlist
          font-size 30px
</style>