<template>
  <transition name="fade">
    <div class="confirm-wrapper" v-show="flag">
      <div class="confirm-box">
        <div class="confirm">
          <div class="text-box">{{text}}</div>
          <div class="control-box">
            <div class="control-left" @click="leftClick">{{left}}</div>
            <div class="control-right" @click="rightClick">{{right}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "Confirm",
    props: {
      text: {
        type: String,
        default: "提示内容"
      },
      left: {
        type: String,
        default: "取消"
      },
      right: {
        type: String,
        default: "确定"
      }
    },
    data() {
      return {
        flag: false
      }
    },
    methods: {
      leftClick() {
        this.$emit("leftClick");
        this.hide();
      },
      rightClick() {
        this.$emit("rightClick");
        this.hide();
      },
      show() {
        this.flag = true;
      },
      hide() {
        this.flag = false;
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .fade-enter-active
    transition all 0.4s ease
    .confirm
      animation scale 0.4s ease
  .fade-enter, .fade-leave-to
    opacity 0

  @keyframes scale
    0%
      transform scale(0)
    60%
      transform scale(1.1)
    100%
      transform scale(1)

  .confirm-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    overflow hidden
    background-color $color-background-d
    .confirm-box
      position absolute
      top 50%
      left 50%
      transform translate3d(-50%, -50%, 0);
      width 270px
      z-index 999
      .confirm
        width 100%
        border-radius 13px
        background-color $color-highlight-background
        .text-box
          padding 19px 15px
          line-height 22px
          text-align center
          font-size $font-size-large
          color $color-text-l
        .control-box
          display flex
          font-size $font-size-large
          div
            flex 1
            text-align center
            padding 10px 0
            border-top 1px solid $color-background-d
            color $color-text-d
          .control-left
            border-right 1px solid $color-background-d

</style>