import {jsonp} from "./jsonp.js";
import {request} from "./request.js";
import {commonParams, options} from "./config.js";

export function getHotData() {
  const url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg";

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });

  return jsonp(url, data, options);

}

export function getResultData(query, page, perpage, zhida) {
  const url = "/api/resultData";

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    n: perpage,
    perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: "json"
  });

  return request({
    url,
    params: data
  })

}
