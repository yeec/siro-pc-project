const path = require("path");
const fs = require("fs");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
module.exports = {
  publicPath: "/",
  devServer: {
    port: 8085,
    proxy: {
      "/water": {
        target: "http://nbzlsmrg.hebeizjkbank.com",
        changeOrigin: true
      }
    },
    before(app) {
      app.get("/mock/api/*", (req, resp) => {
        try {
          const str = req.originalUrl.split("/").pop();
          let api = "";
          if(str.indexOf("?") > 0){ // 包含？
            api = str.split("?")[0]
          }else{
            api = str;
          }
          resp.setHeader("Content-Type", "application/json");
          const file = path.join(
            __dirname,
            "./mock/api/",
            api.replace("do", "json")
          );
          fs.createReadStream(file).pipe(resp);
        } catch (e) {
          console.log("app.get mock异常:" + e);
        }
      });
      app.post("/mock/api/*", (req, resp) => {
        try {
          const str = req.originalUrl.split("/").pop();
          let api = "";
          if(str.indexOf("?") > 0){ // 包含？
            api = str.split("?")[0]
          }else{
            api = str;
          }
          resp.setHeader("Content-Type", "application/json");
          const file = path.join(
            __dirname,
            "./mock/api/",
            api.replace("do", "json")
          );
          fs.createReadStream(file).pipe(resp);
        } catch (e) {
          console.log("app.post mock异常:" + e);
        }
      });
    }
  },
  chainWebpack: config => {
    config.resolve.extensions['.js', '.vue', '.json']
    config.resolve.alias
    .set('@com', resolve('static/lib/index.js'))
    config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
    //const svgRule = config.module.rule('svg')
    //svgRule.uses.clear()
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(resolve("src/icons")) //处理svg目录
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
  }
};
