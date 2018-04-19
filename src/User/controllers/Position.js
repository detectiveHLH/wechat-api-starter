const Response = require('../../Response');
const code = require('../code');
const Position = require('../models/Position');

/**
 * 获取职位(依赖职位名)
 * @param name  职位名
 * @param isAutoCreate  是否自动新增新职位
 */
exports.getByName = async (name, isAutoCreate = true) => {
    let position = await Position.findOne({name : {$regex : new RegExp(name, 'i')}, status : {$gte : 100}});
    if(!position && isAutoCreate && name)
    {
        position = await this.add({name});
    }
    return position;
}

/**
 * 新增职位
 * @param ctx
 */
exports.add = async ctx => {
    let data = ctx;
    if(ctx.app) data = ctx.request.body;

    // 新增时间
    data.create_time = Date.now();
    const position = await Position.create(data);

    if(ctx.app)
    {
        Response.success(ctx, position);
    }
    else
    {
        return position;
    }
}

/**
 * 获取职位
 * @param ctx
 * @returns {position}
 */
exports.get = async ctx => {
    let data = ctx;
    if(ctx.app) data = ctx.request.body;

    let positions = [];
    let condition = {status : {$gte : 100}};
    // 条件:主键
    if(data.id)
    {
        condition._id = data.id;
    }

    // 排序
    const sort = data.sort || {create_time : 'desc'};

    // 获取
    let isGetAll = null;
    if(data.page)
    {
        // 分页
        const limit = parseInt(data.limit) || 10;
        positions = await Position.find(condition).sort(sort).skip(limit * (data.page - 1)).limit(limit + 1);
        // 未取尽
        if(positions.length == limit + 1)
        {
            isGetAll = false;
            positions.splice(limit, 1);
        }
        else
        {
            isGetAll = true;
        }
    }
    else
    {
        positions = await Position.find(condition).sort(sort);
    }

    // 单条返回
    if(data.id && positions.length == 1)
    {
        positions = positions[0];
    }
    else
    {
        // 分页是否取尽
        if(isGetAll === true || isGetAll === false)
        {
            positions = {positions, isGetAll};
        }
    }

    if(ctx.app)
    {
        Response.success(ctx, positions);
    }
    else
    {
        return positions;
    }
}

// ......
