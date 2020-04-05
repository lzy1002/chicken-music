<template>
  <scroll class="recommend-wrapper" :data="discList">
    <div>
      <slider v-if="sliderData.length" :auto-play="autoPlay">
        <div v-for="item in sliderData">
          <a :href="item.linkUrl">
            <img :src="item.picUrl">
          </a>
        </div>
      </slider>
      <div class="disc">
        <h3 class="title">热门歌单推荐</h3>
        <ul class="disc-list">
          <li class="disc-list-item" v-for="item in discList">
            <div class="img-box">
              <img v-lazy="item.imgurl" width="60" height="60">
            </div>
            <div class="content-box">
              <h3 class="name">{{item.creator.name}}</h3>
              <p class="desc">{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </scroll>
</template>

<script>
  import Slider from "../../components/common/silder/Slider.vue";
  import Scroll from "../../components/common/scroll/Scroll.vue";

  import {ERR_OK} from "../../api/config.js";

  import {getSliderData, getDiscList} from "../../api/recommend.js";

  export default {
    name: "Recommend",
    data() {
      return {
        sliderData: [],
        autoPlay: false,
        discList: []
      }
    },
    created() {
      this._getSliderData();
      this._getDiscList();
    },
    methods: {
      _getSliderData() {
        getSliderData().then(res => {
          console.log(res);
          if(res.code === ERR_OK) {
            this.sliderData = res.data.slider;
            console.log(this.sliderData);
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          console.log(res);
          if(res.data.code === ERR_OK) {
            this.discList = res.data.data.list;
            console.log(this.discList);
          }
        })
      }
    },
    components: {
      Slider,
      Scroll
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .recommend-wrapper
    position fixed
    top 88px
    left 0
    right 0
    bottom 0
    overflow hidden
    .disc
      .title
        width 100%
        height 65px
        text-align center
        line-height 65px
        font-size $font-size-medium
        color $color-theme
      .disc-list
        .disc-list-item
          display flex
          padding 0 20px 20px 20px
          .img-box
            width 60px
            height 60px
            padding-right 20px
          .content-box
            flex 1
            display flex
            flex-direction column
            justify-content space-around
            font-size $font-size-medium
            .desc
              color $color-text-d

</style>