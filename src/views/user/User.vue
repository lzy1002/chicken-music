<template>
  <transition name="move">
    <div class="user-wrapper">
      <div class="user-header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <switches :titles="titles"></switches>
      </div>
      <div class="play-btn-box">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from "../../components/common/switches/Switches.vue";

  export default {
    name: "User",
    data() {
      return {
        titles: [{key: "favorite", text: "我喜欢的"}, {key: "lately", text: "最近听的"}],
        sectionFlag: "favorite"
      }
    },
    methods: {
      back() {
        this.$router.back();
      }
    },
    components: {
      Switches
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .move-enter-active, .move-leave-active
    transition all 0.5s ease
  .move-enter, .move-leave-to
    transform translate3d(100%, 0, 0)

  .user-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    overflow hidden
    z-index 998
    background-color $color-background
    .user-header
      margin 10px 0 30px
      .back
        position absolute
        top 0
        left 6px
        font-size $font-size-large-x
        color $color-theme
        .icon-back
          display block
          padding 10px
    .play-btn-box
      .play-btn
        width 135px
        text-align center
        padding 7px 0
        border 1px solid $color-text-l
        color $color-text-l
        border-radius 100px
        margin 0 auto
        font-size 0
        .icon-play
          font-size $font-size-medium-x
          vertical-align middle
          margin-right 6px
        .text
          font-size $font-size-small
          vertical-align middle
</style>