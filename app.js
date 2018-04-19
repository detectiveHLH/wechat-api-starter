const Koa = require('koa');
const app = new Koa();
const config = require('./config/app');
const database = require('./config/database');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const cors = require('koa2-cors');
const static = require('koa-static');
const path = require('path');
const permission = require('./src/Permission');
const Time = require('./utils/Time');
const Utils = require('./utils/Utils');

// 引入成员模块路由
const User = require('./src/User/router');
// 引入微信模块路由
const Wechat = require('./src/WeChat/router');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text'],
    multipart: true
}));

app.use(json());

// 跨域相关设置
app.use(cors({
    origin: ctx => config.allowOrigin.findIndex(v => v == ctx.request.header.origin) == -1 ? false : ctx.request.header.origin,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// 全局变量配置
app.use(async (ctx, next) => {
    global.app = {ctx, dd : {}, user : {}};
    mkdir(ctx.request);
    await next();
});


// 鉴权
app.use(permission.run);

// 路由
app.use(User.routes(), User.allowedMethods());
app.use(Wechat.routes(), Wechat.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

// 数据库
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${database.username}:${database.password}@${database.uri}:${database.port}/${database.name}`, {useMongoClient: true});

function mkdir(request) {
    switch (request.url) {
        case '/main/pass/upload':
            Utils.mkdirsAsync(`./static/uploads/temp/${Time.getTime()}`, null);
            break;
    }
}


// listen
app.listen(config.port);
console.log(`starting at port ${config.port}`);

module.exports = app;
