<template>
  <div class="song-list-wrapper">
    <ul>
      <li class="song-item" v-for="(song, index) in songList" @click="selectItem(song, index)">
        <h3 class="song-name">{{song.songname}}</h3>
        <p class="song-info">{{songInfo(song)}}</p>
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
      }
    },
    methods: {
      songInfo(song) {
        return `${song.singer}·${song.albumname}`;
      },
      selectItem(song, index) {
        this.$emit("select", song, index);
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
      flex-direction column
      justify-content center
      font-size $font-size-medium
      .song-info
        margin-top 10px
        color $color-text-d
        no-wrap()
</style>