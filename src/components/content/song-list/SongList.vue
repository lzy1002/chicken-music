<template>
  <div class="song-list-wrapper">
    <ul>
      <li class="song-item" v-for="(song, index) in songList" @click="selectItem(song, index)">
        <div class="rank-box" v-if="rankFlag">
          <span :class="rankCls(index)">{{rankText(index)}}</span>
        </div>
        <div class="content">
          <h3 class="song-name">{{song.songname}}</h3>
          <p class="song-info">{{songInfo(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "SongList",
    props: {
      songList: {
        type: Array,
        default() {
          return []
        }
      },
      rankFlag: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      songInfo(song) {
        return `${song.singer}·${song.albumname}`;
      },
      selectItem(song, index) {
        this.$emit("select", song, index);
      },
      rankCls(index) {
        if(index <= 2) {
          return `icon icon${index}`;
        }

        return "";
      },
      rankText(index) {
        if(index > 2) {
          return index + 1;
        }

        return "";
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"
  @import "../../../common/stylus/mixin.styl"

  .song-list-wrapper
    padding 20px 30px
    .song-item
      width 100%
      height 64px
      display flex
      font-size $font-size-medium
      .rank-box
        display flex
        align-items center
        justify-content center
        width 25px
        margin-right 30px
        span
          width 25px
          text-align center
          font-size $font-size-large
          color $color-theme
          &.icon
            width 25px
            height 24px
            background-repeat no-repeat
            background-size 25px 24px
          &.icon0
            bg-image("./first")
          &.icon1
            bg-image("./second")
          &.icon2
            bg-image("./third")
      .content
        display flex
        flex 1
        flex-direction column
        justify-content center
        overflow hidden
        no-wrap()
        .song-info
          margin-top 10px
          color $color-text-d
          no-wrap()
</style>