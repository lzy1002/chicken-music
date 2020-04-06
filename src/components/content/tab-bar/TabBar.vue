<template>
  <div class="tab-bar-wrapper">
    <ul class="tab-bar-box">
      <router-link tag="li" class="tab-bar-item" :to="item.router" v-for="item in titles">
        <span class="text">{{item.title}}</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "TabBar",
    props: {
      titles: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        currentIndex: 0
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .tab-bar-wrapper
    width 100%
    height 44px
    .tab-bar-box
      display flex
      height 44px
      .tab-bar-item
        flex 1
        text-align center
        line-height 44px
        .text
          color $color-text-l
          padding-bottom 5px
          font-size $font-size-medium
        &.router-link-active
          .text
            border-bottom 2px solid $color-theme
            color $color-theme
</style>