<template>
  <div class="slider-wrapper" ref="sliderWrapper">
    <div class="content" ref="content">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentIndex === index}" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll";

  import {addClass} from "../../../common/js/dom.js";

  export default {
    name: "Slider",
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: false
      },
      interval: {
        type: Number,
        default: 3000
      }
    },
    data() {
      return {
        dotsLen: 0,
        dots: [],
        currentIndex: 0
      }
    },
    mounted() {
      window.setTimeout(_ => {
        this._initSlider();
        this._initDots();
        this._initScroll();

        window.addEventListener("resize", () => {
          this._initSlider();
          this.scroll.refresh();
          this.resize = true;
        })
      }, 20);
    },
    methods: {
      _initSlider() {
        this.screenWidth = this.$refs.sliderWrapper.clientWidth;
        this.children = this.$refs.content.children;
        let width = 0;

        this.children.forEach((item, index) => {
          addClass(item, "slider-item");
          item.style.width = this.screenWidth + "px";
          width += this.screenWidth;
        });

        if(this.loop && !this.resize) {
          width += this.screenWidth * 2;
        }

        this.$refs.content.style.width = width + "px";

      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.sliderWrapper, {
          click: true,
          scrollY: false,
          scrollX: true,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });

        if(this.autoPlay) {
          this._play();
        }

        this.scroll.on("scrollEnd", () => {
          window.clearTimeout(this.timeId);
          this.currentIndex = this.scroll.getCurrentPage().pageX;
          if(this.autoPlay) {
            this._play();
          }
        })

      },
      _play() {
        this.timeId = window.setTimeout(_ => {
          this.scroll.next();
        }, this.interval);
      },
      _initDots() {
        this.dots = new Array(this.children.length);
      }

    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/variable.styl"

  .slider-wrapper
    position relative
    width 100%
    overflow hidden
    .content
      no-wrap()
      overflow hidden
      .slider-item
        float left
        a
          display block
          width 100%
          height 100%
          img
            width 100%
            vertical-align middle
    .dots
      position absolute
      left 0
      right 0
      bottom 10px
      height 8px
      line-height 8px
      font-size 0
      text-align center
      .dot
        display inline-block
        width 8px
        height 8px
        margin 0 4px
        border-radius 50%
        background-color $color-text-l
        &.active
          width 20px
          height 8px
          border-radius 5px
          background-color  $color-text-ll
</style>