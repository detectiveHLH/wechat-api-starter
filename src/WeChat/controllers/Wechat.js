const sha1 = require('sha1')
const NodeCache = require('node-cache')
const Response = require('../../Response')
const Request = require('../../../utils/Request')
const Util = require('../../../utils/Utils')
const Wechat = require('../../../apis/wechat')
const appConfig = require('../../../config/app')
const code = require('../code')
const Cache = new NodeCache({stdTTL : appConfig.accessTokenTime, checkperiod : 120})

/**
 * 获取微信access_token(给其他项目组使用)
 * @returns {res} 微信全局access_token以及过期时间
 */
exports.getWechatAccessToken = async (ctx, next) => {
  let appid = Wechat.appid
  let secret = Wechat.secret
  let res = await getWechatToken(appid, secret)
  if (res) {
    Response.success(ctx, {access_token : res})
  } else {
    Response.error(ctx, code.OFFICIAL_ACCOUNT_NOT_EXIST)
  }
}

/**
 * 获取微信access_token
 * @returns {access_token}
 */
getWechatToken = async (appid, secret) => {
  let data = {grant_type : Wechat.grant_type, appid : appid, secret : secret},
    url = Wechat.access_token_url,
    res = null,
    access_token = null,
    cache_access_token = await getCache("global_access_token");
  if (cache_access_token) {
    // 不需要重新获取
    access_token = cache_access_token;
  } else {
    // 重新获取
    res = await Request.get(data, url);
    Cache.set('global_access_token', res.access_token, res.expires_in);
    access_token = res.access_token;
  }
  return access_token;
}

/**
 * 获取微信js-sdk,给本地项目使用
 * @returns {jsapi-ticket}
 */
getWechatJsApiTicket = async () => {
  let access_token = await getWechatToken()
  let jsapiUrl = Wechat.get_jsapi_ticket_url
  let data = {access_token : access_token, type : 'jsapi'}
  let jsapiResponse = null
  let jsapi_ticket = null
  let cache_jsapi_ticket = await getCache("global_jsapi_ticket")
  if (cache_jsapi_ticket) {
    // 不需要重新获取
    jsapi_ticket = cache_jsapi_ticket
  } else {
    // 重新获取
    jsapiResponse = await Request.get(data, jsapiUrl)
    Cache.set('global_jsapi_ticket', jsapiResponse.ticket, jsapiResponse.expires_in)
    jsapi_ticket = jsapiResponse.ticket
  }
  return jsapi_ticket
}

/**
 * 获取openID和access_token
 * @param ctx
 * @param next
 * (此接口中 access_token 为页面token , 与全局acces_token有区别)
 */
exports.getSignature = async (ctx, next) => {
  // 获取网页access_token
  let data = {
      grant_type : 'authorization_code',
      appid : Wechat.appid,
      secret : Wechat.secret,
      code : ctx.query.code
    },
    res = null,
    url = Wechat.page_access_token_url,
    access_token = null,
    openid = null;
  res = await Request.get(data, url);
  access_token = res.access_token;
  // 根据access_token 和 openid 获取用户详细信息
  openid = res.openid;
  if (openid) {
    Response.success(ctx, { openid: openid });
  } else {
    Response.error(ctx, code.UNKNOW_ERROR);
  }
}

/**
 * 获取js-sdk的使用权限
 * @param access_token
 * @return jsapi_ticket
 */
exports.getJsApiTicket = async (ctx, next) => {
  let url = ctx.request.header.referer
  let jsapi_ticket = await getWechatJsApiTicket()
  let noncestr = Util.getRandomStr()
  // 取精确到秒的时间戳
  let timestamp = parseInt(new Date().getTime() / 1000) + ''
  let ret = {
    jsapi_ticket : jsapi_ticket,
    nonceStr : noncestr,
    timestamp : timestamp,
    url : url
  }
  let stringBeforeEncryp = raw(ret)
  let signature = sha1(stringBeforeEncryp)
  let responseObj = {
    timestamp : timestamp,
    nonceStr : noncestr,
    signature : signature
  }
  Response.success(ctx, responseObj)
}

// 验证服务器资源
exports.verification = (ctx, next) => {
  let _config = {wechat : {token : Wechat.token}}
  let token = _config.wechat.token,
    signature = ctx.query.signature,
    nonce = ctx.query.nonce,
    timestamp = ctx.query.timestamp,
    echostr = ctx.query.echostr,
    str = [token, timestamp, nonce].sort().join(''),
    sha = sha1(str)
  ctx.body = echostr + ''
}

/**
 * 获取缓存中的数据
 * @param key
 * @return {Promise<any>}
 */
getCache = key => {
  return new Promise((resolve, reject) => {
    Cache.get(key, (err, value) => {
      resolve(value)
    })
  })
}

/**
 * 对传入的对象进行字典序排序，生成键值对并且以&相连的字符串
 * @param args
 * @return {string}
 */
raw = args => {
  let keys = Object.keys(args)
  keys = keys.sort()
  let newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  let string = ''
  for (let k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}
