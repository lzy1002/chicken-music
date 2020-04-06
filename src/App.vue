<template>
  <div id="app">
    <top-header></top-header>
    <tab-bar :titles="titles"></tab-bar>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import TopHeader from "./components/content/header/TopHeader.vue";
  import TabBar from "./components/content/tab-bar/TabBar.vue";

  export default {
    name: "App",
    data() {
      return {
        titles: [
          {title: "推荐", router: "/recommend"},
          {title: "歌手", router: "/singer"},
          {title: "排行", router: "/rank"},
          {title: "搜索", router: "/search"}
        ]
      }
    },
    components: {
      TopHeader,
      TabBar
    }
  }

</script>

<style lang="stylus">

</style>
