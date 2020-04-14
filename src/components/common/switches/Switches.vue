<template>
  <div class="switches-wrapper">
    <ul class="switches">
      <li class="switches-item" :class="{active: activeIndex === index}" v-for="(item, index) in titles" @click="selectItem(item.key, index)">
        <span class="text">{{item.text}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "Switches",
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
        activeIndex: 0
      }
    },
    methods: {
      selectItem(key, index) {
        this.activeIndex = index;
        this.$emit("select", key);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .switches-wrapper
    width 240px
    margin 0 auto
    box-sizing border-box
    .switches
      display flex
      width 240px
      border 1px solid $color-highlight-background
      border-radius 5px
      .switches-item
        flex 1
        padding 8px
        text-align center
        color $color-text-d
        font-size $font-size-medium
        &.active
          background-color $color-highlight-background
          color $color-text

</style>