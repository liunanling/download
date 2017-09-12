/**
 * 通用下载条插件  on 2017/5/9
 * 打开好唱Party
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
    download_party: function (opts) {

      var def = {
        tag: 'haochang',//标识，与app之间定的协议，默认：haochang
        mould: 'app_px',//模板，默认：default，可选择[default,app_px]，暂不支持自定义
        style: 'app_px',//样式，默认：default，可选择[default,app_px]，暂不支持自定义
        isOpenStyle: true,//是否开启样式，默认：true
        roomCode: '',//好唱Party 房间号
        downloadUrl: {//下载地址，以下是默认地址，也可以自定义
          ios: 'https://party-g.haochang.tv/share/download/ios?target=appstore&appdata=',//通用链接 & appstore：
          android: 'https://party.haochang.tv/share/Download/appdl',
          application: 'https://party-g.haochang.tv/share/download/ios?appdata=' //通用链接 & 应用宝->appstore
        },
        haochangAppUrl: {//在外部打开好唱app的地址，以下是默认地址，也可以自定义
          ios: 'chunkyuechang://v1.chunkyuechang.com',
          android: 'chunkyuechang://v1.chunkyuechang.com'
        },
        /**
         * 注意：在callback里面所有的回调函数中，都要加上return false或者return true，不想执行插件里面的方法，在回调的函数里面加上return false，反之，则加上return true
         */
        callback: {//回调
          appCallback: '',//内部浏览器打开的回调
          pcCallback: '',//PC端打开回调
          btnFrontDownloadCallback: '',//点击下载按钮前的回调
          btnBackDownloadCallback: '',//点击下载按钮后的回调
          layerFrontCallback: '', // 关闭前指引蒙层的回调
          layerBackCallback: '' // 关闭后指引蒙层的回调
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
        isAppShow = true,
        flag = false,//控制是按钮的点击
        bindEvent = 'touchstart',
        source = navigator.userAgent.toLowerCase(),
        tagMobile = source.match(/Mobile/i), //是否为移动终端
        mouldAttr = { // 模板集合
          'app_px': '<section id="_guideLayer_haochangPary" class="download-app-px hide"><div class="wrap"><div class="box"><div class="txt-top"><div class="txt-png"></div><div class="txt">请点击<span>右上角</span><i></i><i></i><i></i></div></div><div class="txt-bottom">选择<span>「在浏览器中打开」</span>即可</div></div></div></section>'
        },
        cssAttr = {//样式集合
          'default': 'currency-download-default',
          'app_px': 'currency-download-party-default-px'
        };


      if (opts.isOpenStyle && !$('body').hasClass('currency-download-party-default-px')) {
        require('../css/download_party.css'); //导入外部默认css
      }


      //判断是移动端还是pc端打开
      if (tagMobile == 'mobile') {//移动端

        isAppShow = false;

        //判断是不是内部浏览器打开
        if (source.indexOf(opts.tag) > -1) {
          if (opts.callback.appCallback && !opts.callback.appCallback()) {
            return false;
          }
        }
      } else {//pc端
        if (opts.callback.pcCallback && !opts.callback.pcCallback()) {
          return false;
        }
        isAppShow = false;
        bindEvent = 'click';
      }

      if ($('body').hasClass('currency-download-party-default-px')) {
        isAppShow = true;
      }

      if (!isAppShow) {
        $('body').append(mouldAttr[opts.mould]);//添加模板
        if (opts.isOpenStyle) {
          $('body').addClass(cssAttr[opts.style]);//添加样式
        }
      }


      var _guideLayer_haochangPary = $('#_guideLayer_haochangPary');//蒙层


      //事件
      _this.bind('click', function (event) {
        if (flag) {
          return false;
        }
        flag = true;
        if (opts.callback.btnFrontDownloadCallback && !opts.callback.btnFrontDownloadCallback()) {
          flag = false;
          return false;
        }

        //判断是不是pc端打开
        if (tagMobile != 'mobile') {//pc
          flag = false;
          window.location.href = opts.downloadUrl.android;
          return false;
        }

        if (_guideLayer_haochangPary.hasClass('hide')) {
          if (checkIos()) {//苹果
            if (source.indexOf(opts.tag) > -1) { //好唱内部
              openApp(hcUrl(opts.haochangAppUrl.ios), function (status) {
                if (status == 0) {
                  window.location.href = hcUrl('https://itunes.apple.com/cn/app/hao-changparty-mian-fei-tong/id1112801526?mt=8');
                }
              });

              return false;
            }

            if (checkUniversalLinks()) {//ios9及以上
              flag = false;
              if (checkWechart() || checkWeibo()) {//微博，微信
                window.location.href = opts.downloadUrl.application;
              } else if (checkSafari() || checkQQ() || checkBrowser()) {//safari/qq/其他浏览器
                window.location.href = opts.downloadUrl.ios;
              }
              return false;
            }
            //ios9以下
            if (checkWechart() || checkWeibo() || checkQQ()) {
              flag = false;
              _guideLayer_haochangPary.removeClass('hide');
              return false;
            }
            openApp(opts.haochangAppUrl.ios, function (status) {
              if (status == 0) {
                window.location.href = opts.downloadUrl.ios;
              }
            });
          }
          if (checkAndroid()) {//安卓

            if (source.indexOf(opts.tag) > -1) { //好唱内部浏览器
              openApp(hcUrl(opts.downloadUrl.android), function (status) {
                if (status == 0) {
                  window.location.href = hcUrl(opts.haochangAppUrl.android);
                }
              });

              return false;
            }

            if (checkWechart() || checkWeibo()) {
              _guideLayer_haochangPary.removeClass('hide');
              return false;
            }

            openApp(opts.haochangAppUrl.android, function (status) {
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


      _guideLayer_haochangPary.bind(bindEvent, function (event) {
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
          var _clickTime = +(new Date());

          function check(elsTime) {
            if (elsTime > 1200 || document.hidden) {
              cb(1);
            } else {
              cb(0);
            }
          }

          //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过1200ms，超过则结束
          var _count = 0, intHandle;
          intHandle = setInterval(function () {
            _count++;
            var elsTime = +(new Date()) - _clickTime;
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
        return !checkWechart() && !checkQQ() && !checkWeibo()
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

      //检查是否微博
      function checkWeibo() {
        return source.indexOf("weibo") > 0;
      }

      //safari
      function checkSafari() {
        //排除几个主流浏览器 百度 360 uc qq chrome
        return !/baidubrowser|qhbrowser|ucbrowser|mqqbrowser|crios/.test(source) && /safari/.test(source)
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
          target: 'explorer'
        };
        var _forHC = base64encode(JSON.stringify(forHCObj));
        return 'cqhaochang://v4.haochang.com/' + _forHC;
      }

    }
  });


})(jQuery);