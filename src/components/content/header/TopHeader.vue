<template>
  <div class="header-wrapper">
    <div class="icon"></div>
    <h1 class="title">Chicken Music</h1>
    <div class="user" @click="toUser">
      <i class="icon-mine"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TopHeader",
    methods: {
      toUser() {
        this.$router.push("/user");
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/mixin.styl"
  @import "../../../common/stylus/variable.styl"

  .header-wrapper
    position relative
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
    .user
      position absolute
      top 0
      right 0
      font-size 20px
      color $color-theme
      .icon-mine
        display block
        padding 12px
</style>