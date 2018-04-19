/**
 * 本地 API
 */
module.exports = {
    /**
     * 获取access_token的参数类型
     */
    grant_type : 'client_creden tial',
    /**
     * 微信开发者id
     */
    appid : process.env.NODE_ENV == 'development' ? 'wx3b96ced225ff8eb0' : '',
    /**
     * 微信开发者密码
     */
    secret : process.env.NODE_ENV == 'development' ? '9eadee0fb2c162e78496f504a89e5dea' : '',
    /**
     * 获取 全局 access_token
     */
    access_token_url : 'https://api.weixin.qq.com/cgi-bin/token',
    /**
     * 获取 页面 access_token
     */
    page_access_token_url : 'https://api.weixin.qq.com/sns/oauth2/access_token',
    /**
     * 获取用户详细信息
     */
    get_user_info_url : 'https://api.weixin.qq.com/sns/userinfo',
    /**
     * 服务器资源验证token
     */
    token : process.env.NODE_ENV == 'development' ? 'detectiveHLH' : '',
    /**
     * 发送模板消息连接
     */
    send_template_message_url : 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token',
    /**
     * 获取js-sdk的使用权限
     */
    get_jsapi_ticket_url : 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    /**
     * 微信模板ID
     */
    templateID : process.env.NODE_ENV == 'development' ? 'X1o0n5OnAaKaBF9mLyjk7F-YLFR9nz5MjzZcran57ks' : '',
    /**
     * 从app-api获取access_token的接口
     */
    get_access_token_url : process.env.NODE_ENV == 'development' ? 'http://172.20.70.21:3010/wechat/pass/get_wechat_access_token' : '',
    /**
     * 从app-api根据免登陆code获取用户信息的接口
     */
    get_user_info_url : process.env.NODE_ENV == 'development' ? 'http://172.20.70.21:3010/wechat/pass/get_signature' : '',
};
