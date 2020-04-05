<template>
  <div class="header-wrapper">
    <div class="icon"></div>
    <h1 class="title">Chicken Music</h1>
  </div>
</template>

<script>
  export default {
    name: "TopHeader"
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/mixin.styl"
  @import "../../../common/stylus/variable.styl"

  .header-wrapper
    width 100%
    height 44px
    text-align center
    .icon
      display inline-block
      width 30px
      height 32px
      bg-image("./logo")
      background-repeat no-repeat
      background-position center
      background-size 100%
      margin 6px 8px 0 0
    .title
      display inline-block
      height 44px
      line-height 44px
      vertical-align top
      font-size $font-size-large
      color $color-theme
</style>