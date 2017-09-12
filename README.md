# 通用下载条

标签：jquery版
简便高效的下载条模块, 有了它便能快速完成好唱内部的下载浮窗。

---
## 目录结构
 - src/
     - 存放 download 所有源码
     - sass/
          + 存放 .scss 源码
     - css/
          + download.css
     - img/
          + 存放 图片文件
     - js/
         + download.js
     - lib/
         + 存放第三方依赖类库，如 Jquey.js
 - demo/
    + 示例
 - dist/
    + 发布的文件，从 src/ 自动生成

## 快速开始
### 1.页面上（html）需要导入所需js包，具体目录以具体使用项目中为准
#### 1.1 导入jquery包
```
<script src="dist/lib/jquery-1.11.2.min.js"></script>
```
#### 1.2 导入通用下载条js包
```
<script src="dist/download.js"></script>
```
### 2.页面上需要一个容器，放下载条，例如：
```
<div id='download'></div>
```
### 3.js中的引用
```
$('#download').download({
        tag: 'haochang',//标识，与app之间定的协议，默认：haochang
        mould: 'default',//模板，默认：default，可选择[default,app_px]，暂不支持自定义
        style: 'default',//样式，默认：default，可选择[default,app_px]，暂不支持自定义
        isOpenStyle: true,//是否开启样式，默认：true
        spec: {//配置项
          logoUrl: 'img/icon-logo.png',//logo图片地址
          title: '好唱',//标题
          subtitle: '你身边的好声音',//副标题
          btnValue: '在好唱中打开'//下载按钮，默认‘在好唱中打开’
        },
        downloadUrl: {//下载地址，以下是默认地址
          ios: 'https://itunes.apple.com/cn/app/hao-chang-1miao-bian-ge-shen/id788432982?mt=8',
          android: 'http://www.haochang.tv/download'
        },
        haochangAppUrl: {//在外部打开好唱app的地址，以下是默认地址
          ios: 'cqhaochang://v4.haochang.com/',
          android: 'cqhaochang://v4.haochang.com/'
        },
        callback: {//回调
          appCallback: '',//内部浏览器打开的回调
          pcCallback: '',//PC端打开回调
          btnFrontDownloadCallback: '',//点击下载按钮前的回调
          btnBackDownloadCallback: '',//点击下载按钮后的回调
          layerFrontCallback: '', // 关闭前指引蒙层的回调
          layerBackCallback: '' // 关闭后指引蒙层的回调
        }
});
```
## 参数说明
### 1.1 tag  标识
```
与ios或者android上的app联调商定的协议，默认：'haochang'
```
### 1.2 mould 元素模板
```
页面上显示的内容模板，默认：'default'，可选择[default,app_px]，暂不支持自定义
```
### 1.3 style 样式模板
```
页面上显示的皮肤，默认：'default'，可选择[default,app_px]，暂不支持自定义
```
### 1.4 isOpenStyle 是否开启样式
```
是否开启样式，默认：true，可选true、false
```
### 1.5 spec 配置项
```
logoUrl：logo图片地址，默认：'img/icon-logo.png'；
title：标题，默认：'好唱'；
subtitle: 副标题，默认：'你身边的好声音'；
btnValue: 下载按钮，默认'在好唱中打开'。
```
### 1.6 downloadUrl 下载地址
```
 ios: ios打开的地址，默认：'https://itunes.apple.com/cn/app/hao-chang-1miao-bian-ge-shen/id788432982?mt=8';
 android: android打开的地址，默认： 'http://www.haochang.tv/download'。
```
### 1.7 haochangAppUrl 在外部打开好唱app的地址
```
  ios: ios打开的地址，默认：'cqhaochang://v4.haochang.com/'；
  android: android打开的地址，默认：'cqhaochang://v4.haochang.com/'。
```
### 1.8 callback 回调函数
注意：在callback里面所有的回调函数中，都要加上```return false```或者```return true```，不想执行插件里面的方法，在回调的函数里面加上```return false```，反之，则加上```return true```
```
appCallback: function(){//内部浏览器打开的回调
    、、、、、
    return false;//不执行插件里面的方法
},
pcCallback: function(){ //PC端打开回调
     、、、、、
    return true;//继续执行插件里面的方法
},
btnFrontDownloadCallback: function(){//点击下载按钮前的回调
     、、、、、
    return true;
},
btnBackDownloadCallback: function(){//点击下载按钮后的回调
     、、、、、
    return true;
},
layerFrontCallback: function(){// 关闭前指引蒙层的回调
     、、、、、
    return true;
},
layerBackCallback: function(){// 关闭后指引蒙层的回调
     、、、、、
    return true;
}
```




