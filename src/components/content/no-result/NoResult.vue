<template>
  <div class="no-result-wrapper">
    <div class="img"></div>
    <p class="text">{{text}}</p>
  </div>
</template>

<script>
  export default {
    name: "NoResult",
    props: {
      text: {
        type: String,
        default: "抱歉, 暂无内容"
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"
  @import "../../../common/stylus/mixin.styl"

  .no-result-wrapper
    width 100%
    .img
      width 86px
      height 90px
      margin 0 auto
      background-repeat no-repeat
      background-size 86px 90px
      bg-image("./no-result")
    .text
      text-align center
      margin 30px
      font-size $font-size-medium
      color $color-text-d
</style>