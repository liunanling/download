/**
 * 打开指定好唱页面的插件  on 2017/5/22.
 * 新版本，用了通用链接  ——》打开一个两个app，如果安装了好唱，打开好唱，如果没安装好唱，打开好唱show
 */
/**
 *ios：
 *微信,微博：
 *  ios9以上使用-通用链接(使用重定向到应用宝的通用链接)
 *  ios9以下使用-保留“在浏览器中打开”提示
 *QQ:
 *  ios9以上使用-通用链接(使用重定向到appstore的通用链接)
 *  ios9以下使用-保留“在浏览器中打开”提示
 *
 *safari：
 *  ios9以上使用-通用链接(使用重定向到appstore的通用链接)
 *  ios9以下使用:
 *        iframe的形式打开urischeme
 *        定时器打开appstore
 *
 *其他浏览器：
 *      iframe的形式打开urischeme
 *      定时器打开appstore
 *
 *android：
 *  微信,qq,微博
 *    保留“在浏览器中打开”提示
 *
 *浏览器：
 *    iframe的形式打开urischeme
 *    定时器直接下载页
 *
 */
'use strict';

(function ($) {

  $.fn.extend({
    download_haochang: function download(opts) {

      var def = {
        tag: 'haochang', //标识，与app之间定的协议，默认：haochang
        downloadUrl: { //下载地址，以下是默认地址，也可以自定义
          ios: 'https://api.haochang.tv?market=appstore',
          android: 'https://www.haochang.tv/download',
          application: 'https://api.haochang.tv' //应用宝地址
        },
        appLinks: { //在外部打开好唱app的地址，以下是默认地址，也可以自定义
          ios: 'cqhaochang://v4.haochang.com',
          hcShow: 'cqhaochangshow://v4.haochang.com',
          android: 'cqhaochang://v4.haochang.com'
        }
      };

      opts = $.extend(true, def, opts);

      var appData = {
        url: 'room',
        target: 'app',
        data: {
          roomCode: opts.roomCode
        }
      };

      var _appdata = base64encode(JSON.stringify(appData));
      opts.downloadUrl.ios = opts.downloadUrl.ios + _appdata;
      opts.downloadUrl.application = opts.downloadUrl.application + _appdata;
      opts.haochangAppUrl.ios = opts.haochangAppUrl.ios + '?' + _appdata;
      opts.haochangAppUrl.android = opts.haochangAppUrl.android + '?' + _appdata;

      var _this = this,
        flag = false,
        //控制是按钮的点击
        source = navigator.userAgent.toLowerCase(),
        tagMobile = source.match(/Mobile/i),
        //是否为移动终端
        timeout = null;

      //蒙层
      var _guideLayer = $('#_guideLayer');


      //事件
      _this.bind('click', function (event) {

        if (flag) {
          return false;
        }
        flag = true;


        //判断是不是pc端打开
        if (tagMobile != "mobile") {
          //pc
          flag = false;
          window.location.href = opts.downloadUrl.android;
          return false;
        }
        if (_guideLayer.hasClass('hide')) {
          if (checkIos()) {
            //苹果
            if (checkUniversalLinks()) {
              //ios9及以上
              flag = false;
              if (checkWechart() || checkWeibo()) {

                //微博，微信
                window.location.href = opts.downloadUrl.application;
              } else if (checkSafari() || checkQQ() || checkBrowser()) {
                //alert(opts.downloadUrl.application);
                //safari/qq/其他浏览器
                window.location.href = opts.downloadUrl.ios;
              }
              return false;
            }
            //ios9以下
            if (checkWechart() || checkWeibo() || checkQQ()) {
              flag = false;
              _guideLayer.removeClass('hide');
              return false;
            }
            openApp(opts.appLinks.ios, function (status) {

              if (checkSafari()) {
                var ifrr = document.createElement('iframe');
                ifrr.src = opts.appLinks.hcShow;
                ifrr.style.display = 'none';
                document.body.appendChild(ifrr);
                setTimeout(function () {
                  document.body.removeChild(ifrr);
                  window.location.href = opts.downloadUrl.ios;
                }, 1000);

              } else if (checkUC()) {
                if (status == 0) {
                  var ifrs = document.createElement('iframe');
                  ifrs.src = opts.appLinks.hcShow;
                  ifrs.style.display = 'none';
                  document.body.appendChild(ifrs);
                  setTimeout(function () {
                    document.body.removeChild(ifrs);
                    window.location.href = opts.downloadUrl.ios;
                  }, 1000);
                }
              }
              else {
                if (status == 0) {
                  window.location.href = opts.appLinks.hcShow;
                  setTimeout(function () {
                    window.location.href = opts.downloadUrl.ios;
                  }, 2000);
                }
              }
            });
          }
          if (checkAndroid()) {
            //安卓
            if (checkWechart() || checkWeibo()) {
              _guideLayer.removeClass('hide');
              return false;
            }
            openApp(opts.appLinks.android, function (status) {
              if (status == 0) {
                window.location.href = opts.downloadUrl.android;
              }
            });
          }
        }

        event.stopPropagation();
        return false;

      });


      function openApp(openUrl, callback) {

        flag = false;

        //检查app是否打开
        function checkOpen(cb) {
          var _clickTime = +new Date();

          function check(elsTime) {
            if (elsTime > 1200 || document.hidden) {
              cb(1);
            } else {
              cb(0);
            }
          }

          //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过1200ms，超过则结束
          var _count = 0,
            intHandle;
          intHandle = setInterval(function () {
            _count++;
            var elsTime = +new Date() - _clickTime;
            if (_count >= 50 || elsTime > 1200) {
              clearInterval(intHandle);
              check(elsTime);
            }
          }, 20);
        }

        //在iframe 中打开APP
        var ifr = document.createElement('iframe');
        ifr.src = openUrl;
        ifr.style.display = 'none';
        if (callback) {
          checkOpen(function (opened) {
            callback && callback(opened);
          });
        }

        document.body.appendChild(ifr);
        setTimeout(function () {
          document.body.removeChild(ifr);
        }, 1000);
      }

      //检查是否浏览器
      function checkBrowser() {
        return !checkWechart() && !checkQQ() && !checkWeibo();
      }

      //检查是否为安卓
      function checkAndroid() {
        return source.indexOf("android") > 0;
      }

      //检查是否为ios
      function checkIos() {
        return source.match(/iphone os/i) == 'iphone os' || source.match(/ipad/i) == 'ipad';
      }

      //检查是否ios9及以上
      function checkUniversalLinks() {
        var isPhone = source.match(/OS [0-9]+_\d[_\d]* like Mac OS X/i);
        return isPhone && isPhone.length > 0 && parseInt(isPhone[0].split(" ")[1]) >= 9;
      }

      //检查是否微信
      function checkWechart() {
        return source.indexOf("micromessenger") > 0;
      }

      //检查是否qq 内置浏览器
      function checkQQ() {
        return source.indexOf("qq/") > 0;
      }

      //检查是否uc浏览器
      function checkUC() {
        return source.indexOf('ucbrowser') > -1;
      }

      //检查是否微博
      function checkWeibo() {
        return source.indexOf("weibo") > 0;
      }

      //safari
      function checkSafari() {
        //排除几个主流浏览器 百度 360 uc qq chrome
        return !/baidubrowser|qhbrowser|ucbrowser|mqqbrowser|crios/.test(source) && /safari/.test(source);
      }

      /*
       * Javascript base64encode() base64加密函数
       * @param string input 原始字符串
       * @return string 加密后的base64字符串
       */
      function base64encode(str) {
        var rv;
        rv = encodeURIComponent(str);
        rv = unescape(rv);
        rv = window.btoa(rv);
        return rv;
      }

      /**
       * 生成好唱内部浏览器打开的地址
       * @param u url
       * @returns {string}
       */
      function hcUrl(u) {
        var forHCObj = {
          url: u,
          target: 'app'
        };
        var _forHC = base64encode(JSON.stringify(forHCObj));
        return 'cqhaochang://v4.haochang.com/' + _forHC;
      }


    }
  });
})(jQuery);