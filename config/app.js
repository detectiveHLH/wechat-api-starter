const ip = '你自己的IP地址';

module.exports = {
    // 应用端口
    port : process.env.NODE_ENV == 'development' ? '3003' : '3009',
    // nginx静态资源端口
    nginxPort : process.env.NODE_ENV == 'development' ? '3004' : '80',
    // nginx静态资源地址
    nginxAdd : process.env.NODE_ENV == 'development' ? `http://${ip}:3004` : '',
    // 应用ip
    ip : process.env.NODE_ENV == 'development' ? `http://${ip}`: '',
    // 跨域白名单
    allowOrigin : [
        // 正式网站
        `http://${ip}:8000`,
    ]
};
