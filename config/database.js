module.exports = {
    // 数据库
    name : '',
    // 用户名
    username : process.env.NODE_ENV == 'development' ? '' : '',
    // 密码
    password : process.env.NODE_ENV == 'development' ? '' : '',
    // uri
    uri : 'localhost',
    // 端口
    port : 27017
};
