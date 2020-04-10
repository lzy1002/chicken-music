<template>
  <div class="singer-wrapper" ref="singerWrapper">
    <scroll class="singer-scroll" :data="singerList" :listen-scroll="listenScroll" @scroll="scroll" ref="singerScroll">
      <ul class="title-box">
        <li class="title-item" v-for="item in singerList" ref="titleItem">
          <h1 class="title">{{item.title}}</h1>
          <ul class="singer-box">
            <li class="singer-item" v-for="singer in item.list" @click="toDetail(singer)">
              <div class="img-box">
                <img :src="singer.avatar" alt="">
              </div>
              <div class="content-box">
                <span class="name">{{singer.name}}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="nav-bar" @touchstart.prevent.stop="navBarTouchStart" @touchmove.prevent.stop="navBarTouchMove" ref="navBar">
        <span class="nav-bar-item" :class="{active: currentIndex === index}" v-for="(item, index) in singerList" :data-index="index">{{item.title | formatTitle}}</span>
      </div>
      <div v-show="posY <= 0" class="fixed-title" ref="fixedTitle">{{fixedTitle}}</div>
    </scroll>

    <transition name="move">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Scroll from "../../components/common/scroll/Scroll.vue";

  import {mapMutations} from "vuex";
  import {SET_SINGER} from "../../store/mutations-types.js";

  import {getSingerList} from "../../api/singer.js";
  import {ERR_OK} from "../../api/config.js";

  import {Singer} from "../../common/js/singer.js";
  import {attr} from "../../common/js/dom.js";

  import {playerMixin} from "../../common/js/mixins.js";

  const NAV_ITEM_HEIGHT = 18;
  const FIXED_TITLE_HEIGHT = 30;

  export default {
    name: "Singer",
    mixins: [playerMixin],
    data() {
      return {
        listenScroll: true,
        singerList: [],
        heightArr: [],
        currentIndex: 0,
        touch: {},
        posY: 0,
        diff: -1
      }
    },
    created() {
      this._getSingerList();
    },
    components: {
      Scroll
    },
    methods: {
      _getSingerList() {
        getSingerList().then(res => {
          console.log(res);
          if(res.code === ERR_OK) {
            this.singerList = this._normalizeSinger(res.data.list);
            console.log(this.singerList);
          }
        })
      },
      _normalizeSinger(list) {
        let singer = {
          hot: {
            title: "热门",
            list:[]
          }
        };

        list.forEach((item, index) => {
          if(index < 10) {
            singer.hot.list.push(new Singer(item));
          }

          let Findex = item.Findex;

          if(singer[Findex] !== undefined) {
            singer[Findex].list.push(new Singer(item));
          }else if(singer[Findex] === undefined && /[a-zA-z]/.test(Findex)) {
            singer[Findex] = {
              title: Findex,
              list:[new Singer(item)]
            }
          }
        });

        let hot = [];
        let lis = [];

        for(let key in singer) {
          if(key === "hot") {
            hot.push(singer[key]);
          }else {
            lis.push(singer[key]);
          }
        }

        lis.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });

        return hot.concat(lis);

      },
      _calculateHeight() {
        let heightArr = [];
        let height = 0;
        heightArr.push(height);
        this.$refs.titleItem.forEach(item => {
          heightArr.push(height += item.clientHeight);
        });
        this.heightArr = heightArr;
      },
      scroll(pos) {
        this.posY = pos.y;
      },
      navBarTouchStart(e) {
        this.touch.y1 = e.touches[0].pageY;
        this.touch.activeIndex = attr(e.target, "index");
        this._scrollToElement(this.touch.activeIndex);
      },
      navBarTouchMove(e) {
        let y2 = e.touches[0].pageY;
        let diff = y2 - this.touch.y1;
        let activeIndex = parseInt(this.touch.activeIndex) + Math.floor(diff / NAV_ITEM_HEIGHT);
        this._scrollToElement(activeIndex);
      },
      _scrollToElement(index) {
        let currentElement = this.$refs.titleItem[index];
        this.$refs.singerScroll.scrollToElement(currentElement, 0);
      },
      toDetail(singerData) {
        console.log(singerData);
        this.setSinger(singerData);
        this.$router.push(`/singer/${singerData.mid}`);
      },
      handlePlayerBottom() {
        window.setTimeout(_ => {
          const bottom = this.playList.length > 0 ? 60 : 0;
          this.$refs.singerWrapper.style.bottom = bottom + "px";
          this.$refs.singerScroll.refresh();
        }, 20);
      },
      ...mapMutations({
        setSinger: SET_SINGER
      })
    },
    computed: {
      fixedTitle() {
        return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : "";
      }
    },
    watch: {
      singerList() {
        window.setTimeout(_ => {
          this._calculateHeight();
        }, 20);
      },
      posY() {
        let y = -this.posY;
        for(let i = 0; i< this.heightArr.length; i++) {
          if(i !== this.currentIndex && (y >= this.heightArr[i] && y < this.heightArr[i + 1])) {
            this.currentIndex = i;
          }
        }

        let maxScroll = this.heightArr[this.currentIndex + 1] - FIXED_TITLE_HEIGHT;
        this.diff = y < maxScroll ? 0 : maxScroll - y;
      },
      diff(newVal) {
        this.$refs.fixedTitle.style.top = newVal + "px";
      }
    },
    filters: {
      formatTitle(val) {
        return val.substr(0, 1);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .move-enter-active, .move-leave-active
    transition all 0.5s ease
  .move-enter, .move-leave-to
    transform translate3d(100%, 0, 0)

  .singer-wrapper
    position fixed
    top 88px
    left 0
    right 0
    bottom 0
    overflow hidden
    .singer-scroll
      width 100%
      height 100%
      .title-box
        .title-item
          padding-bottom 30px
          .title
            width 100%
            height 30px
            line-height 30px
            padding-left 20px
            font-size $font-size-small
            color $color-text-l
            background-color #333
          .singer-box
            .singer-item
              display flex
              padding 20px 0 0 30px
              .img-box
                width 50px
                height 50px
                border-radius 50%
                overflow hidden
                img
                  width 100%
              .content-box
                height 50px
                line-height 50px
                padding-left 20px
                font-size $font-size-medium
                color $color-text-l
      .nav-bar
        width 20px
        padding 20px 0
        position absolute
        top 50%
        right 0
        transform translateY(-50%)
        background-color $color-background-d
        border-radius 10px
        .nav-bar-item
          display block
          width 20px
          height 18px
          line-height 18px
          text-align center
          font-size $font-size-small-s
          color $color-text-l
          &.active
            color $color-theme
      .fixed-title
        position absolute
        top 0
        left 0
        right 0
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background-color #333
</style>