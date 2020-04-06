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
