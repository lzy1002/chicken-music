<template>
  <transition name="slide">
    <div class="top-tip-wrapper" @click="topTipClick" v-show="showFlag">
      <i class="icon-ok"></i>
      <span class="text">{{text}}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "TopTip",
    props: {
      text: {
        type: String,
        default: "提示内容"
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        window.clearTimeout(this.timeId);
        this.timeId = window.setTimeout(_ => {
          this.hide();
        }, 2000);
      },
      hide() {
        this.showFlag = false;
      },
      topTipClick() {
        window.clearTimeout(this.timeId);
        this.hide();
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .slide-enter-active, .slide-leave-active
    transition all 0.5s ease
  .slide-enter, .slide-leave-to
    transform translate3d(0, -100%, 0)

  .top-tip-wrapper
    position fixed
    top 0
    left 0
    right 0
    padding 18px 0
    font-size $font-size-medium
    text-align center
    background-color $color-dialog-background
    z-index 1001
    .icon-ok
      color $color-theme
      margin-right 4px
      vertical-align middle
    .text
      color $color-text
      vertical-align middle
</style>