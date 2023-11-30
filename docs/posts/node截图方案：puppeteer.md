---
title: node截图方案：puppeteer
date: 2022-3-7
tags:
  - Node
  - puppeteer
---

截图业务在前端领域是很常见的需求，如用户工作台，图片合成等，在高并发的业务中，使用Node处理截图是一种可实操的手段，本期我们介绍puppeteer

<!--more-->
<hr/>

## puppeteer 与 puppeteer-core?

puppeteer默认会下载最新版Chrome浏览器，在遇到墙的问题时，puppeteer会一直下载中，无法完成，这个时候就需要使用puppeteer-core， puppeteer-core有着和puppeteer一样的功能，除了不下载Chrome，所以我们需要手动下载Chromium，在代码中配置Chromium的启动路径，才可正常使用截图

```
puppeteer.launch({
  executablePath: './chromium/chrome.exe'
})
```

## express

express作为老牌的node框架，在Node实现功能上，有着比Node原生语法更简便的写法，如启动服务

```
Node
const server = http.createServer();
server.listen(4000);

express
const app = express();
app.listen(4000);
```

## Node截图方案

在实际业务中，我们遇到的场景一定是高并发场景，所以我们需要在设计Node截图时就确定方案

1. Node服务启动时启动Chromium静默等待接口请求
2. 响应接口时开启标签页进行截图
3. 截图完成后关闭标签页，浏览器不关闭
4. 浏览器因异常关闭时自动重启，保证Node服务异常

```
const express = require('express');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.listen(4000);
app.use(bodyParser.json({ limit: '50mb' }));

openChromium();
async function openChromium() {
  try {
    global.browser = await puppeteer.launch({
      executablePath: './chromium/chrome.exe',
      headless: false,
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });
    global.browserWSEndpoint = global.browser.wsEndpoint();
    global.browser.on("disconnected", launch)
  } catch {
    throw new Error('chromium启动失败')
  }
}

app.post("/exportImage", async (request, res) => {
  res.end(JSON.stringify({
    data: 'Hello World!'
  }));

  const browser = await puppeteer.connect({
    browserWSEndpoint: await global.browserWSEndpoint,
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  });
  const page = await browser.newPage();
  await page.goto('https://baidu.com');
  fs.mkdirSync('screenshot', { recursive: true });
  const path = `screenshot/${new Date().getTime()}.png`
  await page.screenshot({ path });
  page.close();
})
```
