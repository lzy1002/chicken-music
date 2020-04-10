<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
    <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "ProgressCircle",
    props: {
      radius: {
        type: Number,
        default: 100
      },
      durationTime: {
        type: Number,
        default: 0
      },
      currentTime: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        ratio: 0,
        dashArray: Math.PI * (50 * 2)
      }
    },
    computed: {
      dashOffset() {
        return (1 - this.ratio) * this.dashArray;
      }
    },
    watch: {
      currentTime() {
        this.ratio = this.currentTime / this.durationTime;
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .progress-circle
    position relative
    display flex
    align-items center
    circle
      stroke-width 8px
      transform-origin center
      &.progress-background
        transform scale(0.9)
        stroke $color-theme-d
      &.progress-bar
        transform scale(0.9) rotate(-90deg)
        stroke $color-theme
</style>