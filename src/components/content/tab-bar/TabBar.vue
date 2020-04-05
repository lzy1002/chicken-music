<template>
  <div class="tab-bar-wrapper">
    <ul class="tab-bar-box">
      <li class="tab-bar-item" v-for="(item, index) in titles" @click="selectItem(item.router, index)">
        <span class="text" :class="{active: currentIndex === index}">{{item.title}}</span>
      </li>
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
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      selectItem(router, index) {
        this.$emit("select", router, index);
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
          &.active
            border-bottom 2px solid $color-theme
            color $color-theme
</style>