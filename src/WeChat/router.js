const router = require('koa-router')();
const Wechat = require('./controllers/Wechat');

router.prefix('/wechat');

// 获取公众号签名
router.get('/pass/get_signature', Wechat.getSignature);
// 验证服务器资源
router.post('/pass/verification', Wechat.verification);
// 验证服务器资源
router.get('/pass/verification', Wechat.verification);
// 获取公众号taccess_token(开放给其他的项目)
router.get('/pass/get_wechat_signature', Wechat.getWechatAccessToken)
// 获取jsapi使用权限的接口
router.get('/pass/get_wechat_jsapi', Wechat.getJsApiTicket)

module.exports = router;
