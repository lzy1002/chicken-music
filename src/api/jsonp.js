import originJsonp from "jsonp";

export function jsonp(url, params, options) {  // 封装的jsonp请求 返回一个包裹数据的Promise
  url = mergeParams(url, params);
  return new Promise((resolve, reject) => {
    originJsonp(url, options, function (err, data) {
      if(!err) {
        resolve(data);
      }else {
        reject(err);
      }
    });
  })
}

function mergeParams(url, params) {  // 用于将对象格式的params打平并和url拼接 返回拼接后的url
  let param = "";
  for(let key in params) {
    param += "&" + key;
    param += "=" + params[key];
  }
  param = param.substring(1);

  url += (url.includes("?") ? "&" : "?") + param;
  return url;
}
