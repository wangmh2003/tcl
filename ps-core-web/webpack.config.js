const factory = require("./js/services/services"),
  pathLib = require("path"),
  app = require("express")(),
  smartAngular = require("smart-angular");
const __DEVELOPMENT__ = {
  entry : {
    app : "./app.js"
  },
  output: {
    path: pathLib.join(__dirname, './output'),
    filename: 'output-file.js'
  },
  devtool : 'inline-source-map',
  mode : "development",
  devServer: {
    open : true,
    port : 8090,
    openPage : "app-oc/index.html",
    contentBase: "./",
    inline: true,
    before : function(app){
      //smartAngular("webpackdev", "core")(app);
        smartAngular.run;
    },
    proxy : {
      '/api' : {
        target : factory.origin,
        security : false,
        changeOrigin : true
      }
    }
  }
};
module.exports = __DEVELOPMENT__;