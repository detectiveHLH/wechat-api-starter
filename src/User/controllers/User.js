const Response = require('../../Response');
const code = require('../code');
const Request = require('../../../utils/Request');
const API = require('../../../apis/app');
const Department = require('./Department');
const Position = require('./Position');
const User = require('../models/User');

/**
 * 登录
 * @param ctx
 * @param next
 */
exports.login = async (ctx, next) => {
    let userInfo = await Request.post({code : ctx.request.body.code}, API.DD_LOGIN, API.HEADER);

    if(userInfo.status.code == 0)
    {
        // 请求token
        if(userInfo.data.access_token)
        {
            ctx.cookies.set('access_token', userInfo.data.access_token, {expires : new Date(userInfo.data.access_token_time)});
        }

        // 更新成员信息
        userInfo = await updateUserInfo(userInfo.data);
        Response.success(ctx, userInfo);
    }
    else
    {
        Response.error(ctx, code.LOGIN_ERROR);
    }
}

/**
 * 检测成员
 * @param accessToken
 * @returns {*}
 */
exports.checkUser = async accessToken => {
    return await User.findOne({access_token : accessToken, access_token_time : {$gte : Date.now()}, status : {$gte : 100}});
}

/**
 * 获取成员信息
 * @param ctx
 * @param next
 * @returns {*}
 */
exports.getUserInfo = async (ctx, next) => {
    let userInfo = await Request.post({access_token : ctx.cookies.get('access_token')}, API.DD_GET_USER_INFO, API.HEADER);

    if(userInfo.status.code == 0)
    {
        // 请求token
        if(userInfo.data.access_token)
        {
            ctx.cookies.set('access_token', userInfo.data.access_token, {expires : new Date(userInfo.data.access_token_time)});
        }

        // 更新成员信息
        userInfo = await updateUserInfo(userInfo.data);
        Response.success(ctx, userInfo);
    }
    else
    {
        Response.error(ctx, code.LOGIN);
    }
}

/**
 * 同步组织架构
 * @param ctx
 * @param next
 */
exports.synchronizeUsers = async (ctx, next) => {
    let usersInfo = await Request.post({access_token : ctx.cookies.get('access_token')}, API.DD_GET_USERS_INFO, API.HEADER);

    if(usersInfo.status.code == 0)
    {
        let users = [];
        let departmentIds = [];
        for(let userInfo of usersInfo.data)
        {
            // 更新成员信息
            userInfo = await updateUserInfo(userInfo, false);
            for(const departmentId of userInfo.department_ids)
            {
                if(departmentIds.indexOf(departmentId) == -1)
                {
                    departmentIds.push(departmentId);
                }
            }
            users.push(userInfo);
        }

        // 更新部门信息
        Department.updateForIds({department_ids : departmentIds});

        Response.success(ctx, users);
    }
    else
    {
        Response.error(ctx, code.LOGIN);
    }
}

/**
 * 更新成员信息
 * @param userInfo 成员信息
 * @param isUpdateDepartment 是否更新部门信息
 */
const updateUserInfo = async (userInfo, isUpdateDepartment=true) => {
    if(userInfo.userid) userInfo.user_id = userInfo.userid;

    let newUserInfo = {
        user_id : userInfo.user_id,
        name : userInfo.name,
        mobile : userInfo.mobile,
        avatar : userInfo.avatar,
        email : userInfo.email,
        department_ids : userInfo.department_ids,
        leader_department_ids : userInfo.leader_department_ids
    };

    // 请求token
    if(userInfo.access_token) newUserInfo.access_token = userInfo.access_token;
    if(userInfo.access_token_time) newUserInfo.access_token_time = userInfo.access_token_time;

    // 所属职位ID
    if(userInfo.position) newUserInfo.user_position_id = (await Position.getByName(userInfo.position))._id;

    let user = await User.findOne({user_id : newUserInfo.user_id, status : {$gte : 100}});
    if(!user)
    {
        // 注册
        const time = Date.now();
        newUserInfo.register_time = time;
        newUserInfo.login_time = time;
        newUserInfo.status = 100;
        newUserInfo = await User.create(newUserInfo);

        // 写入关联表
        // ......


    }
    else
    {
        // 更新
        newUserInfo.login_time = Date.now();
        newUserInfo = await User.findByIdAndUpdate(user._id, newUserInfo, {new : true});

        // 更新关联表
        // ......


    }

    // 更新部门信息
    if(isUpdateDepartment)
    {
        Department.updateForIds({department_ids : newUserInfo.department_ids});
    }

    return newUserInfo;
}

// ......

