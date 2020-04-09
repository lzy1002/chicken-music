<template>
  <div class="progress-bar-wrapper" ref="progressWrapper" @click="progressClick">
    <div class="progress-bar">
      <div class="progress-bar-current" ref="progressCurrent"></div>
      <div class="progress-btn" ref="progressBtn" @touchstart="btnTouchStart" @touchmove="btnTouchMove" @touchend="btnTouchEnd"></div>
    </div>
  </div>
</template>

<script>
  const BTN_WIDTH = 16;

  export default {
    name: "ProgressBar",
    props: {
      currentTime: {
        type: Number,
        default: 0
      },
      durationTime: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {};
      this.currentTimeFlag = true;
    },
    methods: {
      progressClick(e) {
        const barWidth = this.$refs.progressWrapper.clientWidth - BTN_WIDTH;
        const barLeft = this.$refs.progressWrapper.offsetLeft;
        const clickLeft = e.pageX;
        const ratio = (clickLeft - barLeft) / barWidth;

        this.$emit("progressChange", ratio);
      },
      btnTouchStart(e) {
        this.currentTimeFlag = false;
        this.touch.touStartLeft = e.touches[0].pageX;
        this.touch.barCurrentWidth = this.$refs.progressCurrent.clientWidth;
      },
      btnTouchMove(e) {
        this.touch.touchMoveLeft = e.touches[0].pageX;
        this.touch.diff = this.touch.touchMoveLeft - this.touch.touStartLeft;
        const barWidth = this.$refs.progressWrapper.clientWidth - BTN_WIDTH;
        this.touch.currentMove = Math.max(0, Math.min(barWidth, this.touch.barCurrentWidth + this.touch.diff));
        this.$refs.progressBtn.style.left = this.touch.currentMove + "px";
        this.$refs.progressCurrent.style.width = this.touch.currentMove + "px";
      },
      btnTouchEnd() {
        this.currentTimeFlag = true;
        const barWidth = this.$refs.progressWrapper.clientWidth - BTN_WIDTH;
        const ratio = this.touch.currentMove / barWidth;

        this.$emit("progressChange", ratio);
      }
    },
    watch: {
      currentTime() {
        if(!this.currentTimeFlag) return;
        const ratio = this.currentTime / this.durationTime;
        const barWidth = this.$refs.progressWrapper.clientWidth - BTN_WIDTH;
        this.$refs.progressCurrent.style.width = barWidth * ratio + "px";
        this.$refs.progressBtn.style.left = barWidth * ratio + "px";

      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .progress-bar-wrapper
    position relative
    width 100%
    height 100%
    .progress-bar
      position absolute
      top 50%
      left 0
      transform translate3d(0, -50%, 0)
      width 100%
      height 4px
      background-color  $color-background-d
      .progress-bar-current
        width 0
        height 100%
        background-color $color-theme
      .progress-btn
        position absolute
        top -6px
        left 0
        width 16px
        height 16px
        border 3px solid #fff
        background-color $color-theme
        border-radius 50%
        box-sizing border-box

</style>