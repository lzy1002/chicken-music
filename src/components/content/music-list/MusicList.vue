<template>
  <div class="music-list-wrapper">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="name">{{name}}</h1>

    <div class="avatar-box" :style="avatar" ref="avatarBox">
      <div class="filter" ref="filter"></div>
      <div class="play-box" ref="playBox">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>

    <div class="mask" ref="mask"></div>
    <scroll class="list-box" :data="list" :listen-scroll="listenScroll" @scroll="scroll" ref="listBox">
      <song-list :song-list="list" @select="selectItem"></song-list>
      <div class="loading-box" v-if="!list.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "../../../components/common/scroll/Scroll.vue";
  import Loading from "../../../components/common/loading/Loading.vue";

  import SongList from "../song-list/SongList.vue";

  import {mapActions} from "vuex";

  const TITLE_HEIGHT = 40;

  export default {
    name: "MusicList",
    props: {
      data: {  // 歌手或歌单的一些信息 从vuex中读取传递到这里
        type: Object,
        default() {
          return {}
        }
      },
      list: {  // 经过处理过后的歌曲列表数组
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        listenScroll: true,
        posY: -1
      }
    },
    created() {
      this.avatarHeight = 0;
    },
    mounted() {
      this._calculateTop();
    },
    methods: {
      back() {
        this.$router.back();
      },
      _calculateTop() {
        this.avatarHeight = this.$refs.avatarBox.clientHeight;
        this.$refs.listBox.$el.style.top = this.avatarHeight + "px";
        this.$refs.mask.style.top = this.avatarHeight + "px";
      },
      scroll(pos) {
        this.posY = pos.y;
      },
      selectItem(song, index) {
        this.addSongList({
            list: this.list,
            index: index
          });
      },
      ...mapActions([
        "addSongList"
      ])
    },
    computed: {
      name() {
        return this.data.name;
      },
      avatar() {
        return `background-image: url(${this.data.avatar})`
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    },
    watch: {
      posY(newVal) {
        let maskNowMove = this.avatarHeight + newVal;
        let maxTopMove = -this.avatarHeight + TITLE_HEIGHT;  // 负值

        if(newVal <= maxTopMove) {
          this.$refs.mask.style.top = TITLE_HEIGHT + "px";

          this.$refs.avatarBox.style.paddingBottom = 0 + "px";
          this.$refs.avatarBox.style.height = TITLE_HEIGHT + "px";
          this.$refs.playBox.style.display = "none";
          this.$refs.avatarBox.style.zIndex = 998;
        }else {
          this.$refs.mask.style.top = maskNowMove + "px";

          this.$refs.avatarBox.style.paddingBottom = 70 + "%";
          this.$refs.avatarBox.style.height = 0;
          this.$refs.playBox.style.display = "block";
          this.$refs.avatarBox.style.zIndex = 0;
        }

        let scale = 1;
        let ratio = Math.abs(newVal / this.avatarHeight);
        let blur = 0;

        if(newVal >= 0) {
          blur = 0;
          this.$refs.avatarBox.style.transform = `scale(${scale + ratio})`;
        }else {
          blur = Math.min(20, Math.max(0, 20 * ratio));
        }
        this.$refs.filter.style.backdropFilter = `blur(${blur}px)`;

      }
    }

  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"
  @import "../../../common/stylus/mixin.styl"

  .music-list-wrapper
    width 100%
    height 100%
    background-color $color-background
    .back
      position absolute
      top 0
      left 6px
      padding 10px
      z-index 999
      .icon-back
        display block
        font-size $font-size-large-x
        color $color-theme
    .name
      position absolute
      left 50%
      top 0
      width 60%
      height 40px
      line-height 40px
      text-align center
      font-size $font-size-large
      transform translate3d(-50%, 0, 0)
      z-index 999
    .avatar-box
      position relative
      padding-bottom 70%
      background-size cover
      background-repeat no-repeat
      transform-origin center top
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)
      .play-box
        position absolute
        left 50%
        bottom 20px
        transform translate3d(-50%, 0, 0)
        width 135px
        padding 7px 0
        text-align center
        color $color-theme
        border-radius 100px
        border 1px solid $color-theme
        font-size $font-size-small
        .icon-play
          font-size $font-size-medium-x
          vertical-align middle
          margin-right 6px
        .text
          vertical-align middle
    .mask
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      background-color $color-background
    .list-box
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      .loading-box
        position absolute
        top 50%
        left 0
        width 100%
        transform translate3d(0, -50%, 0)

</style>