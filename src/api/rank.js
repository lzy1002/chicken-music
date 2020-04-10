import {jsonp} from "./jsonp.js";
import {commonParams, options} from "./config.js";

export function getRankList() {
  const url = "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg";

  const data = Object.assign({}, commonParams, {
    platform: "h5",
    needNewCode: 1
  });

  return jsonp(url, data, options);

}

export function getRankDetail(topid) {
  const url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg";

  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  });

  return jsonp(url, data, options);

}
