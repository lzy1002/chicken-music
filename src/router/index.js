import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Recommend = () => import("../views/recommend/Recommend.vue");
const DiscDetail = () => import("../views/disc-detail/DiscDetail.vue");
const Singer = () => import("../views/singer/Singer.vue");
const SingerDetail = () => import("../views/singer-detail/SingerDetail.vue");
const Rank = () => import("../views/rank/Rank.vue");
const RankDetail = () => import("../views/rank-detail/RankDetail.vue");
const Search = () => import("../views/search/Search.vue");

const routes = [
  {path: "/", redirect: "/recommend"},
  {path: "/recommend", component: Recommend,
    children: [
      {path: ":id", component: DiscDetail}
    ]},
  {path: "/singer", component: Singer,
    children: [
      {path: ":id", component: SingerDetail}
    ]
  },
  {path: "/rank", component: Rank,
    children: [
      {path: ":id", component: RankDetail}
    ]},
  {path: "/search", component: Search,
    children: [
      {path: ":id", component: SingerDetail}
    ]}
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
