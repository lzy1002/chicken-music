export class Singer {
  constructor(singer) {
    this.mid = singer.Fsinger_mid;
    this.name = singer.Fsinger_name;
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.mid}.jpg?max_age=2592000`
  }
}
