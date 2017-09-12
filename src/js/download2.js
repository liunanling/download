/**
 * 通用下载条插件  on 2016/11/1.
 * 老版本
 */
'use strict';

(function ($) {

  $.fn.extend({
    download: function (opts) {

      var def = {
        tag: 'haochang',//标识，与app之间定的协议，默认：haochang
        mould: 'default',//模板，默认：default，可选择[default,app_px]，暂不支持自定义
        style: 'default',//样式，默认：default，可选择[default,app_px]，暂不支持自定义
        isOpenStyle: true,//是否开启样式，默认：true
        spec: {//配置项
          logoUrl: 'img/icon-logo.png',//logo图片地址
          title: '好唱',//标题
          subtitle: '你身边的好声音',//副标题
          btnValue: '在好唱中打开'//下载按钮，默认‘在好唱中打开’，也可以自定义
        },
        downloadUrl: {//下载地址，以下是默认地址，也可以自定义
          ios: 'https://itunes.apple.com/cn/app/hao-chang-1miao-bian-ge-shen/id788432982?mt=8',
          android: 'http://www.haochang.tv/download',
          application: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.michong.haochang' //应用宝地址
        },
        haochangAppUrl: {//在外部打开好唱app的地址，以下是默认地址，也可以自定义
          ios: 'cqhaochang://v4.haochang.com/',
          android: 'cqhaochang://v4.haochang.com/'
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

      var _this = this,
        isAppShow = true,
        flag = false,//控制是按钮的点击
        bindEvent = 'touchstart',
        source = navigator.userAgent.toLowerCase(),
        tagMobile = source.match(/Mobile/i), //是否为移动终端
        mouldAttr = { // 模板集合
          'default': '<section ><div class="appdownload-wrapper"><img class="appdownload-logo left" src="' + opts.spec.logoUrl + '" alt=""><div class="appdownload-title left"><p class="t1 fs32">' + opts.spec.title + '</p><p class="t2 fs28">' + opts.spec.subtitle + '</p></div><input type="hidden"><div class="appdownload-btn right fs28" id="_btnDownloadOpen">' + opts.spec.btnValue + '</div></div><div class="wrapper " id="_guideLayer"><div class="sure"><div class="chose"><div class="point"><div class="show"><span>请点击<a>右上角 </a>●●●</span></div><div></div></div><p>选择<span>「在浏览器中打开」</span>即可</p></div></div></div></section>',
          'app_px': '<section id="_guideLayer" class="hide"><div class="wrap"><div class="box"><div class="txt-top"><div class="txt-png"></div><div class="txt">请点击<span>右上角</span><i></i><i></i><i></i></div></div><div class="txt-bottom">选择<span>「在浏览器中打开」</span>即可</div></div></div></section><footer ><div class="wrap"><div class="footer-left left"><img src="' + opts.spec.logoUrl + '"><div class="web-title right"><p>' + opts.spec.title + '</p><p>' + opts.spec.subtitle + '</p></div></div><div class="footer-rigth right"><a class="web-btn" href="JavaScript:;" id="_btnDownloadOpen" >' + opts.spec.btnValue + '</a></div></div></footer>'
        },
        cssAttr = {//样式集合
          'default': 'currency-download-default',
          'app_px': 'currency-download-default-px'
        };


      //判断是否是默认样式
      if (opts.style.indexOf('default') > -1 && opts.isOpenStyle) {
        //初始化渲染
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        var devWidth = height > width ? width : height;
        if (devWidth > 750) devWidth = 750;//取短后是否会大于640
        document.documentElement.style.fontSize = devWidth / (750 / 100) + 'px';
      }


      if (opts.isOpenStyle) {
        //require('../sass/download.sass'); //导入外部默认css
        require('../css/download.css'); //导入外部默认css
      }


      //判断是移动端还是pc端打开
      if (tagMobile == "mobile") {//移动端
        //判断是不是内部浏览器打开
        if (source.indexOf(opts.tag) > -1) {
          return opts.callback.appCallback && !opts.callback.appCallback();
        } else {
          isAppShow = false;
        }
      } else {//pc端
        if (opts.callback.pcCallback && !opts.callback.pcCallback()) {
          return false;
        }
        isAppShow = false;
        bindEvent = 'click';
      }

      if (!isAppShow) {
        _this.append(mouldAttr[opts.mould]);//添加模板
        if (opts.isOpenStyle) {
          _this.addClass(cssAttr[opts.style]);//添加样式
        }
        //计算添加下载条后，底部的距离
        $('body').css('padding-bottom', '11%');
      }


      var _guideLayer = $('#_guideLayer'),//蒙层
        _btnDownloadOpen = $('#_btnDownloadOpen');//按钮


      //判断是不是在微信、新浪、腾讯内部浏览器中打开
      if (source.match(/MicroMessenger/i) == 'micromessenger') {//微信
        _btnDownloadOpen.attr('href', opts.downloadUrl.application);
        return false;

      }
      //事件
      _btnDownloadOpen.bind(bindEvent, function (event) {
        if (flag) {
          return false;
        }
        flag = true;
        if (opts.callback.btnFrontDownloadCallback && !opts.callback.btnFrontDownloadCallback()) {
          flag = false;
          return false;
        }

        //判断是不是pc端打开
        if (tagMobile != "mobile") {//pc
          flag = false;
          window.location.href = opts.downloadUrl.android;
          return false;
        }

        //判断是不是在微信、新浪、腾讯内部浏览器中打开
        /*if (source.match(/MicroMessenger/i) == 'micromessenger') {//微信
         // _guideLayer.removeClass('hide');
         }*/

        if (source.match(/WeiBo/i) == 'weibo') {//新浪微博
          _guideLayer.removeClass('hide');
        }
        if (source.match(/QQ/i) == 'qq' && source.match(/MQQBrowser/i) != 'mqqbrowser' && source.match(/iphone/i) == 'iphone') {//qq
          // _guideLayer.removeClass('hide');
          window.location.href = opts.downloadUrl.application;
        }


        if (source.match(/iphone os/i) == 'iphone os' || source.match(/ipad/i) == 'ipad') {//是否在IOS浏览器打开

          if (_guideLayer.hasClass('hide')) {

            // 判断ios系统版本号是否小于 8，下面条件成立就表示小于8否则>=8
            var isIphoneEdition = Boolean(source.match(/OS [3-8]_\d[_\d]* like Mac OS X/i));
            if (!isIphoneEdition) {
              flag = false;
              location.href = opts.haochangAppUrl.ios;
              setTimeout(function () {
                location.href = opts.downloadUrl.ios;
              }, 2000);
              return false;
            }

            openApp(opts.haochangAppUrl.ios, function (status) {
              if (status == 0) {
                location.href = opts.downloadUrl.ios;
              }
            });
          }
        } else {//是否在安卓浏览器打开
          if (_guideLayer.hasClass('hide')) {
            openApp(opts.haochangAppUrl.android, function (status) {
              if (status == 0) {
                location.href = opts.downloadUrl.android;
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

    }
  });


})(jQuery);