<template>
  <div class="history-list-wrapper">
    <ul class="history-list">
      <li class="history-item" v-for="item in searchHistory" @click="searchItem(item)">
        <span class="text">{{item}}</span>
        <div class="remove" @click.stop="removeItem(item)">
          <i class="icon-delete"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapActions} from "vuex";

  export default {
    name: "HistoryList",
    props: {
      searchHistory: {
        type: Array,
        default: []
      }
    },
    methods: {
      removeItem(item) {
        this.removeSearchHistory({history: item});
      },
      searchItem(item) {
        this.$emit("searchItem", item);
      },
      ...mapActions([
        "removeSearchHistory"
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .history-list-wrapper
    width 100%
    .history-list
      width 100%
      .history-item
        display flex
        align-items center
        width 100%
        height 40px
        .text
          flex 1
          font-size $font-size-medium-x
          color $color-text-l
        .remove
          font-size $font-size-small
          color $color-text-d

</style>