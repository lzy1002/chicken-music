<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from "better-scroll";

  export default {
    name: "Scroll",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      probeType: {
        type: Number,
        default: 3
      },
      pullUpLoad: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      window.setTimeout(_ => {
        this._initScroll();
      }, 20);
    },
    methods: {
      _initScroll() {
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: this.click,
          probeType: this.probeType,
          pullUpLoad: this.pullUpLoad
        });

        if(this.listenScroll) {
          this.scroll.on("scroll", pos => {
            this.$emit("scroll", pos);
          })
        }

        if(this.pullUpLoad) {
          this.scroll.on("pullingUp", () => {
            this.$emit("pullUp");
            this.scroll.finishPullUp();
          })
        }

      },
      scrollTo(...args) {
        this.scroll.scrollTo(...args);
      },
      scrollToElement(...args) {
        this.scroll.scrollToElement(...args);
      },
      refresh() {
        this.scroll.refresh();
      }
    },
    watch: {
      data() {
        window.setTimeout(_ => {
          this.refresh();
        }, 20);
      }
    }

  }
</script>

<style scoped>

</style>