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
    appid : process.env.NODE_ENV == 'development' ? '你自己的appid' : '正式公众号的appid',
    /**
     * 微信开发者密码
     */
    secret : process.env.NODE_ENV == 'development' ? '你自己的secret' : '正式公众号的secret',
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
    token : process.env.NODE_ENV == 'development' ? '测试号配置的Token' : '正式公众号的Token',
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
};
