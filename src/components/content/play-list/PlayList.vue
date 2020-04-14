<template>
  <transition name="move-fade">
    <div class="play-list-wrapper" v-show="showFlag" @click.stop="hide">
      <div class="play-list" @click.stop>
        <div class="play-list-top">
          <div class="mode-icon" @click="changeMode">
            <i :class="modeIcon"></i>
          </div>
          <span class="mode-text">{{modeText}}</span>
          <div class="clear-box" @click="showConfirm">
            <i class="icon-clear"></i>
          </div>
        </div>
        <div class="play-list-content">
          <scroll class="content-scroll" ref="contentScroll" :data="sequenceList">
            <transition-group class="content" tag="ul" name="list">
              <li class="content-item" ref="contentItem" :key="song.songid" v-for="(song, index) in sequenceList" @click="songClick(song, index)">
                <i class="current" :class="getCurrent(song)"></i>
                <span class="song-name">{{song.songname}}</span>
                <div class="like" @click.stop="favoriteItem(song)">
                  <i :class="favoriteIcon(song)"></i>
                </div>
                <div class="delete" @click.stop="deleteItem(song, index)">
                  <i class="icon-delete"></i>
                </div>
              </li>
            </transition-group>
          </scroll>
        </div>
        <div class="list-operate">
          <div class="add" @click="addList">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="close" @click="hide">关闭</div>
      </div>
      <confirm :text="confirmText" :right="rightText" @rightClick="clearItem" ref="confirm"></confirm>

      <add-list ref="addList"></add-list>
    </div>
  </transition>

</template>

<script>
  import Scroll from "../../../components/common/scroll/Scroll.vue";
  import confirm from "../../../components/common/confirm/Confirm.vue";
  import AddList from "../../../components/content/add-list/AddList.vue";

  import * as modes from "../../../common/js/modes.js";

  import {mapGetters, mapMutations, mapActions} from "vuex";
  import {SET_CURRENT_INDEX, SET_PLAYING} from "../../../store/mutations-types.js";

  import {modeMixin, favoriteMixin} from "../../../common/js/mixins.js";

  export default {
    name: "PlayList",
    mixins: [modeMixin, favoriteMixin],
    data() {
      return {
        showFlag: false,
        confirmText: "清空播放列表",
        rightText: "清空"
      }
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      getCurrent(song) {
        return song.songid === this.currentSong.songid ? "icon-play" : "";
      },
      songClick(song, index) {
        if(this.playMode !== modes.random) {
          this.setCurrentIndex(index);
        }else {
          const index = this.playList.findIndex(item => item.songid === song.songid);
          this.setCurrentIndex(index);
        }
        this.setPlaying(true);
      },
      _scrollToCurrent() {
        const index = this.sequenceList.findIndex(item => item.songid === this.currentSong.songid);
        this.$refs.contentScroll.scrollToElement(this.$refs.contentItem[index], 300);
      },
      deleteItem(song, index) {
        if(this.playList.length === 1) {
          this.setCurrentIndex(-1);
          this.setPlaying(false);
          this.hide();
        }
        this.deleteSong({song: song, index: index});
      },
      clearItem() {
        this.hide();
        this.clearSong();
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      addList() {
        this.$refs.addList.show();
      },
      ...mapMutations({
        setCurrentIndex: SET_CURRENT_INDEX,
        setPlaying: SET_PLAYING
      }),
      ...mapActions([
        "deleteSong",
        "clearSong"
      ])
    },
    computed: {
      modeText() {
        return this.playMode === modes.sequence ? "顺序播放" : this.playMode === modes.loop ? "单曲循环" : "随机播放";
      },
      ...mapGetters([
        "sequenceList",
        "playList",
        "currentSong",
        "playMode"
      ])
    },
    components: {
      Scroll,
      confirm,
      AddList
    },
    watch: {
      showFlag(newVal) {
        if(!newVal) return;
        window.setTimeout(_ => {
          newVal && this.$refs.contentScroll.refresh();
          this._scrollToCurrent();
        }, 20);
      },
      currentSong(newVal, oldVal) {
        if(newVal.songid === oldVal.songid) return;
        window.setTimeout(_ => {
          this._scrollToCurrent();
        }, 100);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"
  @import "../../../common/stylus/mixin.styl"

  .move-fade-enter-active, .move-fade-leave-active
    transition all 0.4s ease
    .play-list
      transition all 0.4s ease
  .move-fade-enter, .move-fade-leave-to
    opacity 0
    .play-list
      transform translate3d(0, 100%, 0)

  .play-list-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background-color $color-background-d
    .play-list
      position absolute
      left 0
      right 0
      bottom 0
      background-color $color-highlight-background
      .play-list-top
        display flex
        align-items center
        padding 20px 30px 10px 20px
        .mode-icon
          font-size 30px
          color $color-theme-d
          margin-right 10px
        .mode-text
          flex 1
          font-size $font-size-medium
          color $color-text-l
        .clear-box
          font-size $font-size-medium
          color $color-text-d
          extend-click()
      .play-list-content
        max-height 240px
        overflow hidden
        .content-scroll
          width 100%
          max-height 240px
          .content
            .content-item
              display flex
              align-items center
              height 40px
              padding 0 30px 0 20px
              overflow hidden
              &.list-enter-active, &.list-leave-active
                transition all 0.1s ease
              &.list-enter, &.list-leave-to
                height 0
              .current
                width 20px
                height 12px
                font-size $font-size-small
                color $color-theme-d
              .song-name
                flex 1
                font-size $font-size-medium
                color $color-text-d
                no-wrap()
              .like
                font-size $font-size-small
                color $color-theme
                margin-right 15px
                extend-click()
                .icon-favorite
                  color $color-sub-theme
              .delete
                font-size $font-size-small
                color $color-theme
                extend-click()
      .list-operate
        width 140px
        margin 20px auto 30px
        .add
          display inline-block
          font-size $font-size-small
          text-align center
          color $color-text-l
          padding 8px 16px
          border 1px solid $color-text-l
          border-radius 15px
          .icon-add
            margin-right 5px
      .close
        width 100%
        height 50px
        line-height 50px
        text-align center
        font-size $font-size-medium-x
        color $color-text-l
        background-color $color-background
      .mask
        position fixed
        top 0
        left 0
        right 0
        bottom 0
        z-index 9
</style>