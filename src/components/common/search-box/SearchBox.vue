<template>
  <div class="search-box-wrapper">
    <div class="search-box">
      <i class="icon-search"></i>
      <input class="box" type="text" :placeholder="placeholder" v-model="search">
      <i class="icon-dismiss" v-show="search" @click="clear"></i>
    </div>
  </div>
</template>

<script>
  import {debounce} from "../../../common/js/utils.js";

  export default {
    name: "SearchBox",
    props: {
      placeholder: {
        type: String,
        default: "请输入搜索内容"
      }
    },
    data() {
      return {
        search: ""
      }
    },
    methods: {
      clear() {
        this.search = "";
      },
      set(newSearch) {
        this.search = newSearch;
      }
    },
    mounted() {
      this.$watch("search", debounce((newVal) => {
        this.$emit("search", newVal);
      }, 100));
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .search-box-wrapper
    margin 20px
    .search-box
      box-sizing border-box
      display flex
      align-items center
      width 100%
      height 40px
      border-radius 6px
      padding 0 6px
      background-color $color-highlight-background
      .icon-search
        font-size 24px
        color $color-background
      .box
        flex 1
        font-size $font-size-medium
        margin 0 5px
        color #fff
        background-color transparent
      .icon-dismiss
        font-size $font-size-medium-x
        color $color-background

</style>