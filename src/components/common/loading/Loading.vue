<template>
  <div class="loading-wrapper">
    <img src="./loading.gif" alt="">
    <p class="text">{{text}}</p>
  </div>
</template>

<script>
  export default {
    name: "Loading",
    props: {
      text: {
        type: String,
        default: "正在载入..."
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .loading-wrapper
    text-align center
    img
      width 24px
      height 24px
    .text
      font-size $font-size-small
      color $color-text-l

</style>