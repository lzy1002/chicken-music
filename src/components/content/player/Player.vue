<template>
  <div class="player-wrapper" v-show="playerIsShow">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="">
        </div>

        <div class="top">
          <div class="hide" @click="hide">
            <i class="icon-back"></i>
          </div>
          <h1 class="song-name" v-html="currentSong.songname"></h1>
          <p class="singer-name" v-html="currentSong.singer"></p>
        </div>

        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="normalCd">
              <div class="cd-box" :class="rotatePlay">
                <img :src="currentSong.image" alt="">
              </div>
            </div>
          </div>
          <div class="middle-r">
            <div class="lyric-box">
              <div class="content">
                <p class="lyric-text"></p>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="progress-wrapper">
            <span class="now-t">{{currentTime | secondToMinute}}</span>
            <div class="progress-bar-box">
              <progress-bar :current-time="currentTime" :duration-time="durationTime" @progressChange="progressChange"></progress-bar>
            </div>
            <span class="total-t">{{durationTime | secondToMinute}}</span>
          </div>
          <div class="control-wrapper">
            <div class="left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="left">
              <i class="icon icon-prev" :class="{disable: !songReady}" @click="prev"></i>
            </div>
            <div class="center">
              <i class="icon" :class="[playIcon, {disable: !songReady}]"  @click="togglePlaying"></i>
            </div>
            <div class="right">
              <i class="icon icon-next" :class="{disable: !songReady}" @click="next"></i>
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
          <img :src="currentSong.image" ref="miniCd" alt="">
        </div>
        <div class="text">
          <h3 class="song-name" v-html="currentSong.songname"></h3>
          <p class="song-singer" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniPlayIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="timeUpDate" @ended="ended"></audio>
  </div>
</template>

<script>
  import ProgressBar from "../progress-bar/ProgressBar.vue";

  import {mapGetters, mapMutations, mapActions} from "vuex";
  import {SET_FULL_SCREEN, SET_PLAYING, SET_CURRENT_INDEX, SET_PLAY_MODE} from "../../../store/mutations-types.js";

  import * as modes from "../../../common/js/modes.js";
  import {shuffle} from "../../../common/js/utils.js";

  import animations from "create-keyframe-animation";
  import LyricParser from "lyric-parser";

  export default {
    name: "Player",
    data() {
      return {
        songReady: false,
        currentTime: 0,
        durationTime: 0
      }
    },
    components: {
      ProgressBar
    },
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
      ready() {
        this.songReady = true;
      },
      error() {
        this.songReady = true;
      },
      play() {
        this.$refs.audio.play();
      },
      pause() {
        this.$refs.audio.pause();
      },
      togglePlaying() {
        if(!this.songReady) return;
        this.setPlaying(!this.playing);
      },
      prev() {
        if(!this.songReady) return;
        if(this.currentIndex === 0) {
          this.setCurrentIndex(this.playList.length - 1);
        }else {
          this.setCurrentIndex(this.currentIndex - 1);
        }
        this.setPlaying(true);
      },
      next() {
        if(!this.songReady) return;
        if(this.currentIndex === this.playList.length - 1) {
          this.setCurrentIndex(0);
        }else {
          this.setCurrentIndex(this.currentIndex + 1);
        }
        this.setPlaying(true);
      },
      timeUpDate() {  // 当歌曲的当前播放时长发生变化时触发
        this.currentTime = this.$refs.audio.currentTime;
      },
      progressChange(ratio) {  // 当点击或者拖动进度条时 进度条组件向外导出的事件 携带当前的比例
        const currentTime = this.durationTime * ratio;
        this.$refs.audio.currentTime = currentTime;
        this.setPlaying(true);
      },
      changeMode() {
        let mode = this.playMode + 1;
        mode = mode % 3;
        this.setPlayMode(mode);
        if(mode === modes.random) {
          const randomList = shuffle(this.sequenceList);
          this.modeChange({list: randomList, currentSong: this.currentSong});
        }else if(mode === modes.sequence) {
          this.modeChange({list: this.sequenceList, currentSong: this.currentSong});
        }

      },
      ended() {
        if(this.playMode === modes.loop) {
          this.$refs.audio.currentTime = 0;
          this.play();
          return;
        }
        this.next();
      },
      _getLyric() {
        this.currentSong.getLyric().then(lyric => {
          this._showLyric(lyric)
        })
      },
      _showLyric(lyric) {
        this.lyricParser = new LyricParser(lyric, this._lyricHandle);
        this.lyricParser.play();
        console.log(this.lyricParser);
      },
      _lyricHandle({lineNum, txt}) {
        console.log(lineNum, txt);
      },
      ...mapMutations({
        setFullScreen: SET_FULL_SCREEN,
        setPlaying: SET_PLAYING,
        setCurrentIndex: SET_CURRENT_INDEX,
        setPlayMode: SET_PLAY_MODE
      }),
      ...mapActions([
        "addSongList",
        "modeChange"
      ])
    },
    computed: {
      playerIsShow() {
        return this.playList.length > 0;
      },
      playIcon() {
        return this.playing ? "icon-pause" : "icon-play";
      },
      miniPlayIcon() {
        return this.playing ? "icon-pause-mini" : "icon-play-mini";
      },
      rotatePlay() {
        return this.playing ? "play-animation" : "play-animation pause";
      },
      modeIcon() {
        return this.playMode === modes.sequence ? "icon-sequence" : this.playMode === modes.loop ? "icon-loop" : "icon-random";
      },
      ...mapGetters([
        "playList",
        "fullScreen",
        "currentSong",
        "playing",
        "currentIndex",
        "playMode",
        "sequenceList"
      ])
    },
    filters: {
      secondToMinute(second) {
        second = parseInt(second);
        let m = Math.floor(second / 60);
        let s = second % 60 > 9 ? second % 60 : "0" + second % 60;

        return `${m}:${s}`;
      },
    },
    watch: {
      playing() {  // 用于控制点击播放按钮时歌曲的播放和暂停
        if(this.playing) {
          this.songReady && this.play();
        }else {
          this.pause();
        }
      },
      songReady(newVal) {  // 当歌曲的ready状态改变时 判断当前ready状态和播放状态是否为true  如果是 那么则播放
        if(newVal && this.playing) {
          this.play();
        }
      },
      currentSong(newVal, oldVal) {  // 当切换歌曲时 先让歌曲的ready状态变为false 这样当切换的歌曲ready时 就会触发watch的songReady的变化 让歌曲播放
        if(newVal === oldVal) return;
        this.songReady = false;
        this.durationTime = this.currentSong.duration;
        this._getLyric();
      }
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

  @keyframes rotatePlay
    from
      transform rotate(0)
    to
      transform rotate(360deg)

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
            position absolute
            left 10%
            height 100%
            width 80%
            .cd-box
              height 100%
              width 100%
              border 10px solid rgba(255, 255, 255, 0.1)
              box-sizing border-box
              border-radius 50%
              overflow hidden
              &.play-animation
                animation rotatePlay 20s linear infinite
                &.pause
                  animation-play-state paused
              img
                width 100%
                height 100%
        .middle-r
          width 100%
          height 100%
          position absolute
          left 0
          top 0
          .lyric-box
            width 80%
            height 100%
            margin 0 auto
            overflow hidden
            .content
              width 100%
              height 100%
              .lyric-text
                height 32px
                line-height 32px
                text-align center
                font-size $font-size-medium
                color $color-text-l
      .bottom
        position absolute
        bottom 50px
        width 100%
        .progress-wrapper
          display flex
          width 80%
          height 30px
          margin 0 auto
          padding 10px 0
          .now-t, .total-t
            display inline-block
            height 30px
            width 30px
            line-height 30px
            font-size $font-size-small-s
          .total-t
            text-align right
          .progress-bar-box
            flex 1
            height 100%
        .control-wrapper
          width 100%
          height 40px
          display flex
          align-items center
          div
            flex 1
            color $color-theme
           .icon
              &.disable
                color $color-theme-d
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