module.exports =  {
  devServer: {
    proxy: {
      "/api/discList": {
        target: "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api/discList": ""
        },
        headers: {
          referer: "https://c.y.qq.com/",
          host: "c.y.qq.com"
        }
      },
      "/api/musicSource": {
        target: "https://u.y.qq.com/cgi-bin/musicu.fcg",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api/musicSource": ""
        },
        headers: {
          referer: "https://c.y.qq.com/",
          host: "c.y.qq.com"
        }
      },
      "/api/lyric": {
        target: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api/lyric": ""
        },
        headers: {
          referer: "https://c.y.qq.com/",
          host: "c.y.qq.com"
        }
      },
      "/api/discDetail": {
        target: "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api/discDetail": ""
        },
        headers: {
          referer: "https://c.y.qq.com/",
          host: "c.y.qq.com"
        }
      }

    }
  }
}
