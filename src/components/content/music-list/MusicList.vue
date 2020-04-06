<template>
  <div class="music-list-wrapper">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="name">{{name}}</h1>

    <div class="avatar-box" :style="avatar">
      <div class="filter"></div>
      <div class="play-box">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>

    <div class="list-box">

    </div>
  </div>
</template>

<script>


  export default {
    name: "MusicList",
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      },
      list: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      back() {
        this.$router.back();
      }
    },
    computed: {
      name() {
        return this.data.name;
      },
      avatar() {
        return `background-image: url(${this.data.avatar})`
      }
    }

  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"
  @import "../../../common/stylus/mixin.styl"

  .music-list-wrapper
    width 100%
    height 100%
    background-color $color-background
    .back
      position absolute
      top 0
      left 6px
      padding 10px
      z-index 999
      .icon-back
        display block
        font-size $font-size-large-x
        color $color-theme
    .name
      position absolute
      left 50%
      top 0
      width 60%
      height 40px
      line-height 40px
      text-align center
      font-size $font-size-large
      transform translate3d(-50%, 0, 0)
      z-index 999
    .avatar-box
      position relative
      padding-bottom 70%
      background-size cover
      background-repeat no-repeat
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)
      .play-box
        position absolute
        left 50%
        bottom 20px
        transform translate3d(-50%, 0, 0)
        width 135px
        padding 7px 0
        text-align center
        color $color-theme
        border-radius 100px
        border 1px solid $color-theme
        font-size $font-size-small
        .icon-play
          font-size $font-size-large
          vertical-align middle
          margin-right 6px
        .text
          vertical-align middle

</style>