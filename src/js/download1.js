/**
 * 通用下载条插件  on 2017/1/5.
 * 新版本，用了通用链接  ——》打开一个两个app，如果安装了好唱，打开好唱，如果没安装好唱，打开好唱show
 * 线上所用版本，为此版本
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
    download: function download(opts) {

      var def = {
        tag: 'haochang', //标识，与app之间定的协议，默认：haochang
        mould: 'default', //模板，默认：default，可选择[default,app_px]，暂不支持自定义
        style: 'default', //样式，默认：default，可选择[default,app_px]，暂不支持自定义
        isOpenStyle: true, //是否开启样式，默认：true
        spec: { //配置项
          logoUrl: 'img/icon-logo.png', //logo图片地址
          title: '好唱', //标题
          subtitle: '你身边的好声音', //副标题
          btnValue: '在好唱中打开' //下载按钮，默认‘在好唱中打开’，也可以自定义
        },
        downloadUrl: { //下载地址，以下是默认地址，也可以自定义
          ios: 'https://new-dev-api.haochang.tv?market=appstore',
          android: 'https://www.haochang.tv/download',
          application: 'https://new-dev-api.haochang.tv' //应用宝地址
        },
        appLinks: { //在外部打开好唱app的地址，以下是默认地址，也可以自定义
          ios: 'cqhaochang://v4.haochang.com/',
          hcShow: 'cqhaochangshow://v4.haochang.com/',
          android: 'cqhaochang://v4.haochang.com/'
        },
        /**
         * 注意：在callback里面所有的回调函数中，都要加上return false或者return true，不想执行插件里面的方法，在回调的函数里面加上return false，反之，则加上return true
         */
        callback: { //回调
          appCallback: '', //内部浏览器打开的回调
          pcCallback: '', //PC端打开回调
          btnFrontDownloadCallback: '', //点击下载按钮前的回调
          btnBackDownloadCallback: '', //点击下载按钮后的回调
          layerFrontCallback: '', // 关闭前指引蒙层的回调
          layerBackCallback: '' // 关闭后指引蒙层的回调
        }
      };

      opts = $.extend(true, def, opts);

      var _this = this,
        isAppShow = true,
        flag = false,
        //控制是按钮的点击
        bindEvent = 'touchstart',
        source = navigator.userAgent.toLowerCase(),
        tagMobile = source.match(/Mobile/i),
        //是否为移动终端
        timeout = null,
        mouldAttr = { // 模板集合
          'default': '<section ><div class="appdownload-wrapper"><img class="appdownload-logo left" src="' + opts.spec.logoUrl + '" alt=""><div class="appdownload-title left"><p class="t1 fs32">' + opts.spec.title + '</p><p class="t2 fs28">' + opts.spec.subtitle + '</p></div><input type="hidden"><div class="appdownload-btn right fs28" id="_btnDownloadOpen">' + opts.spec.btnValue + '</div></div><div class="wrapper " id="_guideLayer"><div class="sure"><div class="chose"><div class="point"><div class="show"><span>请点击<a>右上角 </a>●●●</span></div><div></div></div><p>选择<span>「在浏览器中打开」</span>即可</p></div></div></div></section>',
          'app_px': '<section id="_guideLayer" class="hide"><div class="wrap"><div class="box"><div class="txt-top"><div class="txt-png"></div><div class="txt">请点击<span>右上角</span><i></i><i></i><i></i></div></div><div class="txt-bottom">选择<span>「在浏览器中打开」</span>即可</div></div></div></section><footer ><div class="wrap"><div class="footer-left left"><img src="' + opts.spec.logoUrl + '"><div class="web-title right"><p>' + opts.spec.title + '</p><p>' + opts.spec.subtitle + '</p></div></div><div class="footer-rigth right"><a class="web-btn" href="JavaScript:;" id="_btnDownloadOpen" >' + opts.spec.btnValue + '</a></div></div></footer>'
        },
        cssAttr = { //样式集合
          'default': 'currency-download-default',
          'app_px': 'currency-download-default-px'
        };

      //判断是否是默认样式
      if (opts.style.indexOf('default') > -1 && opts.isOpenStyle) {
        //初始化渲染
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        var devWidth = height > width ? width : height;
        if (devWidth > 750) devWidth = 750; //取短后是否会大于640
        document.documentElement.style.fontSize = devWidth / (750 / 100) + 'px';
      }

      if (opts.isOpenStyle) {
        //require('../sass/download.sass'); //导入外部默认css
        require('../css/download.css'); //导入外部默认css
      }

      //判断是移动端还是pc端打开
      if (tagMobile == "mobile") {
        //移动端
        //判断是不是内部浏览器打开
        if (source.indexOf(opts.tag) > -1) {
          return opts.callback.appCallback && !opts.callback.appCallback();
        } else {
          isAppShow = false;
        }
      } else {
        //pc端
        if (opts.callback.pcCallback && !opts.callback.pcCallback()) {
          return false;
        }
        isAppShow = false;
        bindEvent = 'click';
      }

      if (!isAppShow) {
        _this.append(mouldAttr[opts.mould]); //添加模板
        if (opts.isOpenStyle) {
          _this.addClass(cssAttr[opts.style]); //添加样式
        }
        //计算添加下载条后，底部的距离
        $('body').css('padding-bottom', '11%');
      }

      var _guideLayer = $('#_guideLayer'),
        //蒙层
        _btnDownloadOpen = $('#_btnDownloadOpen'); //按钮

      //事件
      _btnDownloadOpen.bind('click', function (event) {

        if (flag) {
          return false;
        }
        flag = true;
        if (opts.callback.btnFrontDownloadCallback && !opts.callback.btnFrontDownloadCallback()) {
          flag = false;
          return false;
        }

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

        opts.callback.btnBackDownloadCallback && !opts.callback.btnBackDownloadCallback();
        event.stopPropagation();
        return false;

      });

      _guideLayer.bind(bindEvent, function (event) {
        flag = false;
        if (opts.callback.layerFrontCallback && !opts.callback.layerFrontCallback()) {
          return false;
        }
        $(this).addClass('hide');

        opts.callback.layerBackCallback && opts.callback.layerBackCallback();
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
    }
  });
})(jQuery);