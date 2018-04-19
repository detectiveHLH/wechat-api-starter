# Wechat Official Account Api Starter

## 特性

- 快速的搭建自己的微信公众号（服务号）后台开发环境
- 已有验证服务器、微信鉴权接口，直接使用即可
- 基于koa2框架

## 使用
- 请确认有注册成功的测试号，并且完成相关测试号配置(验证服务器的接口为/wechat/pass/verification),
  并且搭配[wechat-starter](https://github.com/detectiveHLH/wechat-starter)一起使用
- 修改/apis/wechat.js中的appid为自己的appid，secret为自己的secret，
  token改为自己配置的Token
- 修改/config/app.js中的ip地址为自己的ip地址
- 在/config/database.js中配置自己的数据库（为mongodb，采用mongoose插件）
  （该步骤不影响微信鉴权）

```bash
$ npm install
$ npm start         # 访问 http://localhost:8000
```

