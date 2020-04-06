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
      }

    }
  }
}
