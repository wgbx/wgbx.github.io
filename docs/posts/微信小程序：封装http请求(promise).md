---
title: 微信小程序：封装http请求(promise)
date: 2018-06-15 15:54:03
tags:
  - 微信小程序
  - http
---

使用 promise思路封装小程序请求

<!--more-->
<hr/>

## config.js

一般来说，所有项目都需要建立一个config.js来储存项目的一些基本信息，如公钥私钥或是环境参数

```js
const config = {
  api_base_url: 'https://music.163.com/'
}
export { config }
```

## http封装

- 创建http.js文件，定义HTTP类
- 定义公用请求方法
- 导出当前类

```js
import { config } from '../config'
const tips = {
  1: '抱歉,出现了一个错误'
}
class HTTP {
  request({ url, data = {}, method = 'GET' }) {
    return new Promise((resolve, reject) => {
      wx.request({
        header: {
          'content-type': 'application/json',
          appkey: config.appkey
        },
        url: config.api_base_url + url,
        data: data,
        method: method,
        success: res => {
          if (res.data == success) {
            resolve(res.data)
          } else {
            reject(err)
            let errorCode = res.data.error_code
            this._show_error(errorCode)
          }
        },
        fail: err => {
          reject(err)
          this._show_error(1)
        }
      })
    })
  }
  _show_error(errorCode) {
    wx.showToast({
      title: tips[errorCode ? errorCode : 1],
      icon: 'none',
      duration: 2000
    })
  }
}
export { HTTP }
```

## Api封装

```js
import { HTTP } from '../util/httpPromise'
class musicModel extends HTTP {
  getUserInfo() {
    return this.request({
      url: 'api/v1/user/detail/251282779'
    })
  }
}
export { musicModel }
```

## 调用

```js
import {
  musicModel
} from '../models/music'
let musicModel = new musicModel();

getUserInfo(){
    musicModel.getUserInfo().then(res => {
        this.setData({
          info: res
        })
    })
}

/*or*/

getUserInfo(){
    const getUserInfo =  musicModel.getUserInfo();
    Promise.all([getUserInfo]).then(res=>{
    this.setData({
         info: res[0]
      })
    })
}
```
