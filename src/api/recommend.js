import {jsonp} from "./jsonp.js";
import {request} from "./request.js";
import {commonParams, options} from "./config";

export function getSliderData() {  // 获取轮播图数据
  const url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";

  const data = Object.assign({}, commonParams, {
    platform: "h5",
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);
}

export function getDiscList() {  // 获取推荐歌单列表
  const url = "/api/discList";

  const data = Object.assign({}, commonParams, {
    platform: "yqq",
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: "json"
  });

  return request({
    url,
    params: data
  })
}

export function getDiscDetail(disstid) {
  const url = "/api/discDetail";

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: "json"
  });

  return request({
    url,
    params: data
  })

}
