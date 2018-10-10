(function(global, factory){
  if(typeof define == "function"){
    define(['angular'], factory);
  } else {
    var angular = {
      module : function(){}
    }
    if(typeof module == "object"){

      if(module.exports){
        module.exports = factory(angular, "CMD", global);
      }
    } else {
      if (global == window) {
        window.$services = factory(angular, "window", global);
      }
    }
  }
})(this, function(angular, ref, global){
  'use strict';
  var factory, services = angular.module('services', ['ngResource']);
  var injectParams = ['$http', '$rootScope', '$location', '$q', 'growl'];
  var allrequests = [];
  global = global || window;
  global.__LINKAGE__ = global.__LINKAGE__ || 'xinbada';
  factory = (function(linkage){
    var factory, version = "V2";
    switch (linkage) {
        case 'xinbada' :
            factory = {version: version, protocol: "ws:", host: "47.94.14.146", origin: "http://47.94.14.146"};
            break;
      case 'xinhuaxin' :
        factory = {version: version, protocol: "ws:", host: "47.95.207.156", origin: "http://47.95.207.156"};
        break;
      case '122' :
        factory = {version: version, protocol: "ws:", host: "192.168.1.122", origin: "http://192.168.1.122"};
        break;
      case '106' :
        factory = {version: version, protocol: "ws:", host: "106.74.18.92", origin: "http://106.74.18.92"};
        break;
      case '129' :
        factory = {version: version, protocol: "ws:", host: "192.168.1.129", origin: "http://192.168.1.129"};
        break;
      case '91' :
        factory = {version: version, protocol: "ws:", host: "10.26.10.91", origin: "http://10.26.10.91"};
        break;
      case '156' :
        factory = {version: version, protocol: "ws:", host: "47.95.207.156", origin: "http://47.95.207.156"};
        break;
      case '159' :
        factory = {version: version, protocol: "wss:", host: "180.76.147.159", origin: "http://180.76.147.159"};
        break;
      case '112' :
        factory = {version: version, protocol: "wss:", host: "192.168.1.112", origin: "http://192.168.1.112"};
        break;
      case '116' :
        factory = {version:version,protocol:"wss:",host:"192.168.1.116",origin:"http://192.168.1.116"};
        break;
      case '117' :
        factory = {version:version,protocol:"ws:",host:"192.168.1.117",origin:"http://192.168.1.117"};
        break;
      case '11780' :
        factory = {version:version,protocol:"ws:",host:"36.110.36.118:11780",origin:"http://36.110.36.118:11780"};
        break;
      case 'yunneng' :
        factory = {version: version, protocol: "wss:", host: "39.108.59.125", origin: "http://39.108.59.125"};
        break;
      case '204' :
        factory = {version: version, protocol: "wss:", host: "180.76.166.204", origin: "http://180.76.166.204"};
        break;
      case 'raonecloud' :
        factory = {
          version: version,
          protocol: "wss:",
          host: "yzt.raonecloud.com",
          origin: "https://yzt.raonecloud.com"
        };
        break;
      case '135' :
        factory = {version: version, protocol: "wss:", host: "192.168.1.135", origin: "http://192.168.1.135"};
        break;
      case '139' :
        factory = {version: version, protocol: "wss:", host: "192.168.1.139", origin: "http://192.168.1.139"};
        break;
      case '121' :
        factory = {version: version, protocol: "wss:", host: "192.168.1.121", origin: "http://192.168.1.121"};
        break;
      case '131' :
        factory = {version: version, protocol: "wss:", host: "192.168.1.131", origin: "https://192.168.1.131"};
        break;
      case '132' :
        factory = {version: version, protocol: "wss:", host: "10.27.16.132", origin: "http://10.27.16.132"};
        break;
      case '133' :
        factory = {version: version, protocol: "wss:", host: "10.27.16.133", origin: "http://10.27.16.133"};
        break;
      case '114' :
        factory = {version: version, protocol: "wss:", host: "192.168.1.114", origin: "http://192.168.1.114"};
        break;
      case '118' :
        factory = {
          version: version,
          protocol: "wss:",
          host: "36.110.36.118:6443",
          origin: "https://36.110.36.118:6443"
        };
        break;
      case 'demo' :
        factory = {
          version: version,
          protocol: "wss:",
          host: "demo.proudsmart.com",
          origin: "https://demo.proudsmart.com"
        };
        break;
        case 'xinbada' :
            factory = {
                version: version,
                protocol: "ws:",
                host: "47.94.14.146",
                origin: "http://47.94.14.146"
            };
            break;

      case 'baidu' :
        factory = {
          version: version,
          protocol: "wss:",
          host: "iot.proudsmart.com",
          origin: "https://iot.proudsmart.com"
        };
        break;
      case 'ouke' :
        factory = {
          version: version,
          protocol: "wss:",
          host: "www.ek-cloud.net",
          origin: "http://www.ek-cloud.net"
        };
        break;
      case 'denuo' :
        factory = {
          version: version,
          protocol: "wss:",
          host: "http://36.110.36.118:8099",
          origin: "http://36.110.36.118:8099"
        };
        break;
      default :
        throw new Error('请选择一个访问链接');
        break;
    }
    factory.getUrl = function(global){
      /** 只有当localhost:63342下面访问才需要跨域，其它接口都为同域 */
      if(global != window){
        throw new Error("只可在WINDOW环境下执行，NODEJS环境下不可执行！");
      }
      var hostname = global.location.hostname;
      var port = global.location.port;
      if(hostname == "localhost" && port == "63342"){
        return this.origin; /** 跨域时地址配置 */
      } else {
        return ""; /** 同域时地址配置 */
      }
    };
    return factory;
  })(global.__LINKAGE__)
  var authFactory = function ($http, $rootScope, $location, $q, growl) {
    var params = getUrlParams();
    var token = params["token"];
    var version = params["version"] ? params["version"] : "V2";
    factory.version = version;
    if (window.location.host && window.location.host.search('localhost') == -1 && window.location.host.search('127.0.0.1') == -1 && window.location.host.search('192.168.199.223') == -1) {
      factory.host = window.location.host;
      if (window.location.origin != undefined) {
        factory.origin = window.location.origin;
      } else {
        factory.origin = "https://" + window.location.host;
      }
      if (window.location.protocol == "https:") {
        factory.protocol = "wss:";
      } else {
        factory.protocol = "ws:";
      }
    }
    /** 应用webpack-dev-server启动服务器暂定8080端口，代理解决开发时跨域问题 */
    var serviceBase = (function(loc){
      var host = loc.host;
      function isLocalHost(host){
        var localhostLike = new RegExp("localhost", "g");
        return localhostLike.test(host);
      }
      if(isLocalHost(host) && window.location.port == "63342"){
        return factory.origin + "/";
      } else {
        return loc.origin + "/";
      }
    })(window.location);
    /** 应用webpack-dev-server启动服务器暂定8080端口，代理解决开发时跨域问题 */
    factory.get = function (service, method, param, callBack, err, extendstr) {
      var cancel = $q.defer();
      if (typeof callBack != "function") {
        console.log(service, method, callBack);
      }
      if (!angular.isString(param)) {
        param = angular.copy(param);
        param = JSON.stringify(param);
      }
      var route = (function(s){
        if(s == "nodejsapi"){
          return "api/node"
        } else if(service.indexOf("/") > -1){
          return "api/rest/";
        } else {
          return "api/rest/post/"
        }
      })(service);
      service = service == "nodejsapi" ? "" : service;
      var url = serviceBase + route + service + "/" + method+(extendstr?("?"+extendstr):"");
      //var url = "/api/rest/post/" + service + "/" + method+(extendstr?("?"+extendstr):"");
      if (token != null) {
        url += "?token=" + token;
      }
      var config = {
        timeout : cancel.promise
      }
      var callToken = $http.post(url, param, config);
      function emptyCall(){
        return null;
      }
      callToken.success && callToken.success(success) || callToken.then(success);
      function success(e) {
        e = e.status == 200 ? e.data : e;
        callToken.kill = emptyCall;
        if (callBack != null) {
          if (e.code == 0) {
            callBack(e);
          }
          else {
            if (e.message.search("需要用户登录才能使用") > -1) {
              var dt = e.data;
              dt = ( dt[0] == "/" ) && dt.slice(1) || dt;
              location.href = "../" + dt;
              callBack({
                code: 0,
                data: {}
              });
            } else if (e.code > 9999) {
              growl.info(e.message, {});
              callBack(e);
            } else {
              console.error(url, "方法调用发生错误");
              console.error("参数：", JSON.stringify(param, null, 2));
              console.error("错误编码" + e.code + ":" + e.message)
              growl.error("错误编码" + e.code + ":" + e.message, {});
              callBack(e);
            }
          }
        }
      };
      callToken.error && callToken.error(error) || callToken.catch(error);
      function error(data) {
        var err = "";
        if (status == -1)
          err = "(HTTP status:" + status + ")服务器连接已中断，请刷新页面";
        else
          err = "网络链接异常，请刷新页面";
        callToken.kill == emptyCall && growl.error(err, {});
        callToken.kill = emptyCall;
      };
      callToken.kill = function(){
        console.log("kill!!");
        cancel.resolve("kill");
        var inx = allrequests.indexOf(this);
        allrequests.splice(inx, 1);
      }
      allrequests.push(callToken)
      return callToken;
    };
    var d = new Date();
    var gmtMilliseconds = d.getTimezoneOffset() * 60 * 1000;
    factory.removeAllRequest = function(){
        console.log("allrequests", allrequests);
        for(var i in allrequests){
          allrequests[i].kill();
        }
    }
    function convertDateToString(input) {
      // Ignore things that aren't objects.
      if (typeof input !== "object") return input;
      for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;
        var value = input[key];
        if (angular.isDate(value)) {
          value.setMilliseconds(value.getMilliseconds() - gmtMilliseconds);
          input[key] = value.toJSON();
        } else if (typeof value === "object") {
          convertDateToString(value);
        }
      }
    }
    function getUrlParams() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    }
    return factory;
  };
  authFactory.$inject = injectParams;
  if(ref == "CMD" || ref == "window"){
    return factory;
  } else {
    services.factory('serviceProxy', authFactory);
    return services;
  }
});
