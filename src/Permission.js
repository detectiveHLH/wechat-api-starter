const Response = require('./Response');
const User = require('./User/controllers/User');
const Request = require('../utils/Request');

exports.run = async (ctx, next) => {
    const url = ctx.url.split('/');
    // 不鉴权
    if(url[2] == 'pass')
    {
        await next();
    }
    // 鉴权
    else
    {
        if(ctx.cookies.get('access_token'))
        {
            // 鉴权
            const user = await User.checkUser(ctx.cookies.get('access_token'));
            if(!user)
            {
                Response.error(ctx, 1, '请登录');
            }
            else
            {
                global.app.user = user;
                await next();
            }
        }
        else
        {
            // 未登录
            Response.error(ctx, 1, '请登录');
        }
    }
}
