import {request} from "./request.js";
import {commonParams, options} from "./config.js";

import {ERR_OK} from "./config.js";

export function getMusicSource(songs) {
  const url = "/api/musicSource";

  let mids = [];
  let types = [];

  songs.forEach(item => {
    mids.push(item.songmid);
    types.push(0);
  });

  const comm = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });

  const data = {
    comm,
    req_0: {
      module: 'vkey.GetVkeyServer',
      method: 'CgiGetVkey',
      param: {
        guid: getUid(),
        songmid: mids,
        songtype: types,
        uin: '0',
        loginflag: 0,
        platform: '23'
      }
    }
  };

  return new Promise((resolve, reject) => {
    request({
      url,
      method: "post",
      data
    }).then(res => {
      if(res.data.code === ERR_OK) {
        let urlSongs = songAddUrl(songs, res.data.req_0.data.midurlinfo);
        resolve(urlSongs);
      }
    })
  })
}

function songAddUrl(songs, urlInfo) {
  let map = {};

  urlInfo.forEach(item => {
    map[item.songmid] = item.purl;
  });

  let urlSongs = songs.filter(song => {
    if(map[song.songmid] === "") {
      return false;
    }
    song.url = map[song.songmid];
    return true;
  });

  return urlSongs;
}

let _uid = "";
export function getUid() {
  if(_uid) {
    return _uid;
  }
  if(!_uid) {
    const t = (new Date()).getUTCMilliseconds();
    _uid = "" + Math.round(2147483647 * Math.random()) * t % 1e10;
  }
  return _uid;
}
