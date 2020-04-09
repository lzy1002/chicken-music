import {request} from "../../api/request.js";
import {commonParams} from "../../api/config.js";
import {ERR_OK} from "../../api/config.js";

import {Base64} from "js-base64";

export class Song {
  constructor({songid, songmid, songname, albumname, duration, singer, image}) {
    this.songid = songid;
    this.songmid = songmid;
    this.songname = songname;
    this.albumname = albumname;
    this.duration = duration;
    this.singer = singer;
    this.image = image;
  }
  getLyric() {
    if(this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.songmid).then(res => {
        if(res.data.code === ERR_OK) {
          this.lyric = Base64.decode(res.data.lyric);
          resolve(this.lyric);
        }
      })
    })
  }

}

function getLyric(mid) {
  const url = "/api/lyric";

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: "yqq",
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: "json"
  });

  return request({
    url,
    params: data
  })

}

export function createSong(musicData) {
  return new Song({
    songid: musicData.songid,
    songmid: musicData.songmid,
    songname: musicData.songname,
    albumname: musicData.albumname,
    duration: musicData.interval,
    singer: filterSinger(musicData.singer),
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`  // 封面图片地址
  })
}

function filterSinger(singer) {
  let singerName = "";

  singer.forEach(item => {
    singerName += "/" + item.name;
  });

  return singerName.slice(1);
}
