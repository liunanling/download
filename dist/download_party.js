/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

		/******/ 		// Check if module is in cache
		/******/ 		if(installedModules[moduleId])
		/******/ 			return installedModules[moduleId].exports;

		/******/ 		// Create a new module (and put it into the cache)
		/******/ 		var module = installedModules[moduleId] = {
			/******/ 			exports: {},
			/******/ 			id: moduleId,
			/******/ 			loaded: false
			/******/ 		};

		/******/ 		// Execute the module function
		/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ 		// Flag the module as loaded
		/******/ 		module.loaded = true;

		/******/ 		// Return the exports of the module
		/******/ 		return module.exports;
		/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "./dist/";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
/************************************************************************/
/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

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

    var _stringify = __webpack_require__(1);

    var _stringify2 = _interopRequireDefault(_stringify);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    (function ($) {

      $.fn.extend({
        download_party: function download_party(opts) {

          var def = {
            tag: 'haochang', //标识，与app之间定的协议，默认：haochang
            mould: 'app_px', //模板，默认：default，可选择[default,app_px]，暂不支持自定义
            style: 'app_px', //样式，默认：default，可选择[default,app_px]，暂不支持自定义
            isOpenStyle: true, //是否开启样式，默认：true
            roomCode: '', //好唱Party 房间号
            downloadUrl: { //下载地址，以下是默认地址，也可以自定义
              ios: 'https://party-g.haochang.tv/share/download/ios?target=appstore&appdata=', //通用链接 & appstore：
              android: 'https://party.haochang.tv/share/Download/appdl',
              application: 'https://party-g.haochang.tv/share/download/ios?appdata=' //通用链接 & 应用宝->appstore
            },
            haochangAppUrl: { //在外部打开好唱app的地址，以下是默认地址，也可以自定义
              ios: 'chunkyuechang://v1.chunkyuechang.com',
              android: 'chunkyuechang://v1.chunkyuechang.com'
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

          var appData = {
            url: 'room',
            target: 'app',
            data: {
              roomCode: opts.roomCode
            }
          };

          var _appdata = base64encode((0, _stringify2.default)(appData));
          opts.downloadUrl.ios = opts.downloadUrl.ios + _appdata;
          opts.downloadUrl.application = opts.downloadUrl.application + _appdata;
          opts.haochangAppUrl.ios = opts.haochangAppUrl.ios + '?' + _appdata;
          opts.haochangAppUrl.android = opts.haochangAppUrl.android + '?' + _appdata;

          var _this = this,
            isAppShow = true,
            flag = false,
            //控制是按钮的点击
            bindEvent = 'touchstart',
            source = navigator.userAgent.toLowerCase(),
            tagMobile = source.match(/Mobile/i),
            //是否为移动终端
            mouldAttr = { // 模板集合
              'app_px': '<section id="_guideLayer_haochangPary" class="download-app-px hide"><div class="wrap"><div class="box"><div class="txt-top"><div class="txt-png"></div><div class="txt">请点击<span>右上角</span><i></i><i></i><i></i></div></div><div class="txt-bottom">选择<span>「在浏览器中打开」</span>即可</div></div></div></section>'
            },
            cssAttr = { //样式集合
              'default': 'currency-download-default',
              'app_px': 'currency-download-party-default-px'
            };

          if (opts.isOpenStyle && !$('body').hasClass('currency-download-party-default-px')) {
            __webpack_require__(4); //导入外部默认css
          }

          //判断是移动端还是pc端打开
          if (tagMobile == 'mobile') {
            //移动端

            isAppShow = false;

            //判断是不是内部浏览器打开
            if (source.indexOf(opts.tag) > -1) {
              if (opts.callback.appCallback && !opts.callback.appCallback()) {
                return false;
              }
            }
          } else {
            //pc端
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
            $('body').append(mouldAttr[opts.mould]); //添加模板
            if (opts.isOpenStyle) {
              $('body').addClass(cssAttr[opts.style]); //添加样式
            }
          }

          var _guideLayer_haochangPary = $('#_guideLayer_haochangPary'); //蒙层


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
            if (tagMobile != 'mobile') {
              //pc
              flag = false;
              window.location.href = opts.downloadUrl.android;
              return false;
            }

            if (_guideLayer_haochangPary.hasClass('hide')) {
              if (checkIos()) {
                //苹果
                if (source.indexOf(opts.tag) > -1) {
                  //好唱内部
                  openApp(hcUrl(opts.haochangAppUrl.ios), function (status) {
                    if (status == 0) {
                      window.location.href = hcUrl('https://itunes.apple.com/cn/app/hao-changparty-mian-fei-tong/id1112801526?mt=8');
                    }
                  });

                  return false;
                }

                if (checkUniversalLinks()) {
                  //ios9及以上
                  flag = false;
                  if (checkWechart() || checkWeibo()) {
                    //微博，微信
                    window.location.href = opts.downloadUrl.application;
                  } else if (checkSafari() || checkQQ() || checkBrowser()) {
                    //safari/qq/其他浏览器
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
              if (checkAndroid()) {
                //安卓

                if (source.indexOf(opts.tag) > -1) {
                  //好唱内部浏览器
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
              target: 'explorer'
            };
            var _forHC = base64encode((0, _stringify2.default)(forHCObj));
            return 'cqhaochang://v4.haochang.com/' + _forHC;
          }
        }
      });
    })(jQuery);

		/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

    module.exports = { "default": __webpack_require__(2), __esModule: true };

		/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

    var core  = __webpack_require__(3)
      , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
    module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
      return $JSON.stringify.apply($JSON, arguments);
    };

		/***/ },
	/* 3 */
	/***/ function(module, exports) {

    var core = module.exports = {version: '2.4.0'};
    if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

		/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {

    // style-loader: Adds some css to the DOM by adding a <style> tag

    // load the styles
    var content = __webpack_require__(5);
    if(typeof content === 'string') content = [[module.id, content, '']];
    // add the styles to the DOM
    var update = __webpack_require__(8)(content, {});
    if(content.locals) module.exports = content.locals;
    // Hot Module Replacement
    if(false) {
      // When the styles change, update the <style> tags
      if(!content.locals) {
        module.hot.accept("!!./../../node_modules/css-loader/index.js!./download_party.css", function() {
          var newContent = require("!!./../../node_modules/css-loader/index.js!./download_party.css");
          if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
          update(newContent);
        });
      }
      // When the module is disposed, remove the <style> tags
      module.hot.dispose(function() { update(); });
    }

		/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {

    exports = module.exports = __webpack_require__(6)();
    // imports


    // module
    exports.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n  border-width: 0;\n  list-style: none;\n  background-repeat: no-repeat;\n  font-family: \"Microsoft yahei\";\n}\nimg {\n  width: 100%;\n  height: 100%;\n}\na img{border:none;}\n\n.hide {\n  display: none;\n}\n\n.show {\n  display: block;\n}\n\n\n/**下载条样式 ——（app_px）***********************************************************************************/\n/**\n * 当前css文档，单位是px\n */\n.currency-download-party-default-px{width: 100%;height: auto;}\n.currency-download-party-default-px .download-app-px { width: 100%; height: 100%; position: fixed;top:0;left: 0; background: rgba(0, 0, 0, 0.8); z-index: 99999999; cursor: pointer; }\n.currency-download-party-default-px .download-app-px .wrap { width: 85%;height: 100%;  margin: 0 auto; color: #FFFFFF; font-size: 18px; position: relative; }\n.currency-download-party-default-px .download-app-px .wrap::after { clear: both; content: ' '; display: block; width: 0; height: 0; visibility: hidden; }\n.currency-download-party-default-px .download-app-px .wrap .box { position: absolute; top: 8px; right: 0; width: 85%;}\n.currency-download-party-default-px .download-app-px .wrap span { color: #ffa200; }\n.currency-download-party-default-px .download-app-px .wrap .txt-top { position: relative; zoom: 1; _zoom: 1; margin-bottom: 2%; }\n.currency-download-party-default-px .download-app-px .wrap .txt-top::after { clear: both; content: ' '; display: block; width: 0; height: 0; visibility: hidden; }\n.currency-download-party-default-px .download-app-px .wrap .txt-top .txt { position: absolute; bottom: 0; }\n.currency-download-party-default-px .download-app-px .wrap .txt-top i { width: 5px; height: 5px; border-radius: 50%; background: #FFF; display: inline-block; margin-left: 3px;}\n.currency-download-party-default-px .download-app-px .wrap .txt-top .txt-png{background: url(" + __webpack_require__(7) + ") no-repeat;width: 50%;float: right; background-size: 100%; padding-bottom: 83%; }\n\n\n@media screen and (max-width: 321px) {\n  .currency-download-party-default-px .download-app-px .wrap { font-size: 15px; } }\n\n/**end 下载条默认样式***********************************************************************************/", ""]);

    // exports


		/***/ },
	/* 6 */
	/***/ function(module, exports) {

		/*
		 MIT License http://www.opensource.org/licenses/mit-license.php
		 Author Tobias Koppers @sokra
		 */
    // css base code, injected by the css-loader
    module.exports = function() {
      var list = [];

      // return the list of modules as css string
      list.toString = function toString() {
        var result = [];
        for(var i = 0; i < this.length; i++) {
          var item = this[i];
          if(item[2]) {
            result.push("@media " + item[2] + "{" + item[1] + "}");
          } else {
            result.push(item[1]);
          }
        }
        return result.join("");
      };

      // import a list of modules into the list
      list.i = function(modules, mediaQuery) {
        if(typeof modules === "string")
          modules = [[null, modules, ""]];
        var alreadyImportedModules = {};
        for(var i = 0; i < this.length; i++) {
          var id = this[i][0];
          if(typeof id === "number")
            alreadyImportedModules[id] = true;
        }
        for(i = 0; i < modules.length; i++) {
          var item = modules[i];
          // skip already imported module
          // this implementation is not 100% perfect for weird media query combinations
          //  when a module is imported multiple times with different media queries.
          //  I hope this will never occur (Hey this way we have smaller bundles)
          if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
            if(mediaQuery && !item[2]) {
              item[2] = mediaQuery;
            } else if(mediaQuery) {
              item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
            }
            list.push(item);
          }
        }
      };
      return list;
    };


		/***/ },
	/* 7 */
	/***/ function(module, exports) {

    module.exports = "data:image/png;base64,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"

		/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {

		/*
		 MIT License http://www.opensource.org/licenses/mit-license.php
		 Author Tobias Koppers @sokra
		 */
    var stylesInDom = {},
      memoize = function(fn) {
        var memo;
        return function () {
          if (typeof memo === "undefined") memo = fn.apply(this, arguments);
          return memo;
        };
      },
      isOldIE = memoize(function() {
        return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
      }),
      getHeadElement = memoize(function () {
        return document.head || document.getElementsByTagName("head")[0];
      }),
      singletonElement = null,
      singletonCounter = 0,
      styleElementsInsertedAtTop = [];

    module.exports = function(list, options) {
      if(false) {
        if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
      }

      options = options || {};
      // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
      // tags it will allow on a page
      if (typeof options.singleton === "undefined") options.singleton = isOldIE();

      // By default, add <style> tags to the bottom of <head>.
      if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

      var styles = listToStyles(list);
      addStylesToDom(styles, options);

      return function update(newList) {
        var mayRemove = [];
        for(var i = 0; i < styles.length; i++) {
          var item = styles[i];
          var domStyle = stylesInDom[item.id];
          domStyle.refs--;
          mayRemove.push(domStyle);
        }
        if(newList) {
          var newStyles = listToStyles(newList);
          addStylesToDom(newStyles, options);
        }
        for(var i = 0; i < mayRemove.length; i++) {
          var domStyle = mayRemove[i];
          if(domStyle.refs === 0) {
            for(var j = 0; j < domStyle.parts.length; j++)
              domStyle.parts[j]();
            delete stylesInDom[domStyle.id];
          }
        }
      };
    }

    function addStylesToDom(styles, options) {
      for(var i = 0; i < styles.length; i++) {
        var item = styles[i];
        var domStyle = stylesInDom[item.id];
        if(domStyle) {
          domStyle.refs++;
          for(var j = 0; j < domStyle.parts.length; j++) {
            domStyle.parts[j](item.parts[j]);
          }
          for(; j < item.parts.length; j++) {
            domStyle.parts.push(addStyle(item.parts[j], options));
          }
        } else {
          var parts = [];
          for(var j = 0; j < item.parts.length; j++) {
            parts.push(addStyle(item.parts[j], options));
          }
          stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
        }
      }
    }

    function listToStyles(list) {
      var styles = [];
      var newStyles = {};
      for(var i = 0; i < list.length; i++) {
        var item = list[i];
        var id = item[0];
        var css = item[1];
        var media = item[2];
        var sourceMap = item[3];
        var part = {css: css, media: media, sourceMap: sourceMap};
        if(!newStyles[id])
          styles.push(newStyles[id] = {id: id, parts: [part]});
        else
          newStyles[id].parts.push(part);
      }
      return styles;
    }

    function insertStyleElement(options, styleElement) {
      var head = getHeadElement();
      var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
      if (options.insertAt === "top") {
        if(!lastStyleElementInsertedAtTop) {
          head.insertBefore(styleElement, head.firstChild);
        } else if(lastStyleElementInsertedAtTop.nextSibling) {
          head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
          head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
      } else if (options.insertAt === "bottom") {
        head.appendChild(styleElement);
      } else {
        throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
      }
    }

    function removeStyleElement(styleElement) {
      styleElement.parentNode.removeChild(styleElement);
      var idx = styleElementsInsertedAtTop.indexOf(styleElement);
      if(idx >= 0) {
        styleElementsInsertedAtTop.splice(idx, 1);
      }
    }

    function createStyleElement(options) {
      var styleElement = document.createElement("style");
      styleElement.type = "text/css";
      insertStyleElement(options, styleElement);
      return styleElement;
    }

    function createLinkElement(options) {
      var linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      insertStyleElement(options, linkElement);
      return linkElement;
    }

    function addStyle(obj, options) {
      var styleElement, update, remove;

      if (options.singleton) {
        var styleIndex = singletonCounter++;
        styleElement = singletonElement || (singletonElement = createStyleElement(options));
        update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
        remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
      } else if(obj.sourceMap &&
        typeof URL === "function" &&
        typeof URL.createObjectURL === "function" &&
        typeof URL.revokeObjectURL === "function" &&
        typeof Blob === "function" &&
        typeof btoa === "function") {
        styleElement = createLinkElement(options);
        update = updateLink.bind(null, styleElement);
        remove = function() {
          removeStyleElement(styleElement);
          if(styleElement.href)
            URL.revokeObjectURL(styleElement.href);
        };
      } else {
        styleElement = createStyleElement(options);
        update = applyToTag.bind(null, styleElement);
        remove = function() {
          removeStyleElement(styleElement);
        };
      }

      update(obj);

      return function updateStyle(newObj) {
        if(newObj) {
          if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
            return;
          update(obj = newObj);
        } else {
          remove();
        }
      };
    }

    var replaceText = (function () {
      var textStore = [];

      return function (index, replacement) {
        textStore[index] = replacement;
        return textStore.filter(Boolean).join('\n');
      };
    })();

    function applyToSingletonTag(styleElement, index, remove, obj) {
      var css = remove ? "" : obj.css;

      if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = replaceText(index, css);
      } else {
        var cssNode = document.createTextNode(css);
        var childNodes = styleElement.childNodes;
        if (childNodes[index]) styleElement.removeChild(childNodes[index]);
        if (childNodes.length) {
          styleElement.insertBefore(cssNode, childNodes[index]);
        } else {
          styleElement.appendChild(cssNode);
        }
      }
    }

    function applyToTag(styleElement, obj) {
      var css = obj.css;
      var media = obj.media;

      if(media) {
        styleElement.setAttribute("media", media)
      }

      if(styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css;
      } else {
        while(styleElement.firstChild) {
          styleElement.removeChild(styleElement.firstChild);
        }
        styleElement.appendChild(document.createTextNode(css));
      }
    }

    function updateLink(linkElement, obj) {
      var css = obj.css;
      var sourceMap = obj.sourceMap;

      if(sourceMap) {
        // http://stackoverflow.com/a/26603875
        css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
      }

      var blob = new Blob([css], { type: "text/css" });

      var oldSrc = linkElement.href;

      linkElement.href = URL.createObjectURL(blob);

      if(oldSrc)
        URL.revokeObjectURL(oldSrc);
    }


		/***/ }
	/******/ ]);