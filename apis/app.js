// 一般不用改
const SERVER = 'http://app-api.tap4fun.com';

// 企业
const enterprise = process.env.NODE_ENV == 'development' ? 'something' : '';

/**
 * app-api.tap4fun.com API
 */
module.exports = {
    // 请求头
    HEADER : {'Content-type' : 'application/json; charset=utf-8'},

    /**
     * 获取钉钉请求token
     */
    DD_GET_TOKEN : `${SERVER}/dd/get_token?app_enterprise=${enterprise}`,

    /**
     * 获取钉钉签名
     */
    DD_GET_SIGNATURE : `${SERVER}/dd/get_signature?app_enterprise=${enterprise}`,

    /**
     * 钉钉登录
     * @param code 钉钉免登code
     */
    DD_LOGIN : `${SERVER}/dd/pass/login?app_enterprise=${enterprise}`,

    /**
     * 钉钉获取成员信息
     * @param access_token 请求token
     */
    DD_GET_USER_INFO : `${SERVER}/dd/get_user_info?app_enterprise=${enterprise}`,

    /**
     * 钉钉获取所有成员信息
     * @param access_token 请求token
     */
    DD_GET_USERS_INFO : `${SERVER}/dd/get_users_info?app_enterprise=${enterprise}`,

    /**
     * 钉钉获取部门信息
     * @param access_token 请求token
     * @param department_ids 部门ID列表
     */
    DD_GET_DEPARTMENTS_INFO : `${SERVER}/dd/get_departments_info?app_enterprise=${enterprise}`,

    /**
     * 微信请求access_token
     * @param type 公众号标识 [recruit, nibirutech]
     */
    WECHAT_GET_TOKEN : `${SERVER}/wechat/pass/get_wechat_signature`,
};
