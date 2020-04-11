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

        <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="normalCd">
              <div class="cd-box" :class="rotatePlay">
                <img :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-box">
              <div class="playing-lyric">{{txt}}</div>
            </div>
          </div>
          <div class="middle-r" ref="middleR">
            <scroll class="lyric-box" ref="lyricBox" :data="lyricArr">
              <div class="content">
                <p class="lyric-text" ref="lyricText" :class="{active: lineNum === index}" v-for="(item, index) in lyricArr">{{item.txt}}</p>
              </div>
            </scroll>
          </div>
        </div>

        <div class="bottom">
          <div class="dots-box">
            <span class="dot" :class="{active: middleFlag === 'cd'}"></span>
            <span class="dot" :class="{active: middleFlag === 'lyric'}"></span>
          </div>
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
          <img :src="currentSong.image" class="mini-cd" :class="rotatePlay" ref="miniCd" alt="">
        </div>
        <div class="text">
          <h3 class="song-name" v-html="currentSong.songname"></h3>
          <p class="song-singer" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :duration-time="durationTime" :current-time="currentTime">
            <i class="mini-control" :class="miniPlayIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
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
  import Scroll from "../../common/scroll/Scroll.vue";
  import ProgressCircle from "../progress-circle/ProgressCircle.vue";

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
        durationTime: 0,
        lyricArr: [],
        middleFlag: "cd",
        lineNum: 1,
        txt: ""
      }
    },
    created() {
      this.touch = {};
    },
    components: {
      ProgressBar,
      Scroll,
      ProgressCircle
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
        this.lyricParser && this.lyricParser.togglePlay();
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
      loop() {
        this.$refs.audio.currentTime = 0;
        this._seekLyric(0);
        this.play();
      },
      timeUpDate() {  // 当歌曲的当前播放时长发生变化时触发
        this.currentTime = this.$refs.audio.currentTime;
      },
      progressChange(ratio) {  // 当点击或者拖动进度条时 进度条组件向外导出的事件 携带当前的比例
        const currentTime = this.durationTime * ratio;
        this.$refs.audio.currentTime = currentTime;
        this._seekLyric(currentTime * 1000);
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
          this.loop();
          return;
        }
        this.next();
      },
      _getLyric() {
        this.currentSong.getLyric().then(lyric => {
          this._showLyric(lyric);
        })
      },
      _showLyric(lyric) {
        this._stopLyric();
        this.lyricParser = new LyricParser(lyric, this._lyricHandle);
        this.lyricArr = this.lyricParser.lines;
        this._playLyric();
      },
      _lyricHandle({lineNum, txt}) {
        this.lineNum = lineNum;
        this.txt = txt;
      },
      _playLyric() {
        this.lyricParser && this.lyricParser.play();
      },
      _stopLyric() {
        this.lyricParser && this.lyricParser.stop();
      },
      _seekLyric(currentTime) {
        this.lyricParser && this.lyricParser.seek(currentTime);
      },
      middleTouchStart(e) {
        this.$refs.middleR.style.transition = "none";
        this.$refs.middleL.style.transition = "none";
        this.touch.ratio = 0;

        this.touch.targetX = this.middleFlag === "cd" ? -window.innerWidth : 0;
        this.touch.currentX = this.middleFlag === "cd" ? 0 : -window.innerWidth;
        this.touch.targetOpacity = this.middleFlag === "cd" ? 0 : 1;
        this.touch.currentOpacity = this.middleFlag === "cd" ? 1 : 0;
        this.touch.startX = e.touches[0].pageX;
      },
      middleTouchMove(e) {
        this.touch.diffX = e.touches[0].pageX - this.touch.startX;
        let moveX = this.touch.currentX + this.touch.diffX;
        moveX = Math.max(-window.innerWidth, Math.min(0, moveX));
        this.$refs.middleR.style.transform = `translate3d(${moveX}px, 0, 0)`;
        if((this.middleFlag === "cd" && this.touch.diffX < 0) || (this.middleFlag === "lyric" && this.touch.diffX > 0)) {
          this.touch.ratio = Math.abs(this.touch.diffX) / window.innerWidth;
        }
        this.$refs.middleL.style.opacity = this.middleFlag === "cd" ? 1 - this.touch.ratio : this.touch.ratio;
      },
      middleTouchEnd() {
        if(this.touch.ratio >= 0.3) {
          this.$refs.middleR.style.transition = "all 0.4s ease";
          this.$refs.middleR.style.transform = `translate3d(${this.touch.targetX}px, 0, 0)`;
          this.$refs.middleL.style.transition = "all 0.4s ease";
          this.$refs.middleL.style.opacity = this.touch.targetOpacity;
          this.middleFlag = this.middleFlag === "cd" ? "lyric" : "cd";
        }else {
          this.$refs.middleR.style.transition = "all 0.4s ease";
          this.$refs.middleR.style.transform = `translate3d(${this.touch.currentX}px, 0, 0)`;
          this.$refs.middleL.style.transition = "all 0.4s ease";
          this.$refs.middleL.style.opacity = this.touch.currentOpacity;
        }

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
        this.$refs.lyricBox.scrollTo(0, 0, 100);
        this._getLyric();
      },
      lineNum(newVal) {
        if(newVal < 5) {
          return;
        }
        const currentLyric = this.$refs.lyricText[newVal - 5];
        this.$refs.lyricBox.scrollToElement(currentLyric, 1000);
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
          height 0
          padding-top 80%
          text-align center
          box-sizing border-box
          .cd-wrapper
            position absolute
            top 0
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
          .playing-lyric-box
            width 80%
            height 20px
            margin 30px auto 0
            .playing-lyric
              width 100%
              height 20px
              line-height 20px
              text-align center
              font-size $font-size-medium
              color $color-text-l
        .middle-r
          width 100%
          height 100%
          position absolute
          left 100%
          top 0
          .lyric-box
            width 100%
            height 100%
            overflow hidden
            .content
              width 80%
              margin 0 auto
              .lyric-text
                height 32px
                line-height 32px
                text-align center
                font-size $font-size-medium
                color $color-text-l
                overflow hidden
                no-wrap()
                &.active
                  color #fff
      .bottom
        position absolute
        bottom 50px
        width 100%
        .dots-box
          width 100%
          height 8px
          text-align center
          .dot
            display inline-block
            width 8px
            height 8px
            margin 0 4px
            border-radius 50%
            background-color $color-text-l
            &.active
              width 20px
              border-radius 10px
              background-color $color-text-ll
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
        .mini-cd
          width 100%
          border-radius 50%
          &.play-animation
            animation rotatePlay 20s linear infinite
            &.pause
              animation-play-state paused
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
        .mini-control
          position absolute
          top 0
          left 0
        .icon-playlist
          font-size 30px
</style>