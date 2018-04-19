const Response = require('../../Response');
const code = require('../code');
const Request = require('../../../utils/Request');
const API = require('../../../apis/app');
const Department = require('../models/Department');

/**
 * 更新部门
 * @param ctx | data:数据
 */
exports.update = async ctx => {
    let data = ctx;
    if(ctx.app) data = ctx.request.body;

    let department = await Department.findOne({department_id : data.department_id});
    if(!department)
    {
        // 注册
        department = await Department.create(data);
    }
    else
    {
        // 更新
        department = await Department.findByIdAndUpdate(department._id, data, {new : true});
        // 更新关联表

    }

    if(ctx.app)
    {
        Response.success(ctx, department);
    }
    else
    {
        return department;
    }
}

/**
 * 更新部门
 * @param ctx | data:数据
 * @param department_ids 部门ID列表
 */
exports.updateForIds = async ctx => {
    let data = ctx;
    if(ctx.app) data = ctx.request.body;

    let departmentsInfo = [];
    const departments = await Request.post({department_ids : data.department_ids, access_token : global.app.ctx.cookies.get('access_token')}, API.DD_GET_DEPARTMENTS_INFO, API.HEADER);;
    if(departments.status.code == 0)
    {
        for(const department of departments.data)
        {
            departmentsInfo.push(await this.update(department));
        }
    }
    else
    {
        departmentsInfo = null;
    }

    if(ctx.app)
    {
        Response.success(ctx, departmentsInfo);
    }
    else
    {
        return departmentsInfo;
    }
}

/**
 * 获取部门
 * @param ctx | data
 * @param id  主键
 * @param name  部门名
 * @param departmentId  部门ID
 * @param departmentIds  部门ID数组
 * @param isLeader  是否只选管理部门 (true时将只可选自己管理部门(包括子部门))
 * @param sort  排序规则
 * @param page  页数
 * @param limit  获取条数
 * @return 不分页:[{DEPARTMENT}]  分页:{isGetAll:是否获取完, departments:[{DEPARTMENT}]}
 */
exports.get = async ctx => {
    let data = ctx;
    if(ctx.app) data = ctx.request.body;

    let departments = [];
    let condition = {};
    // 条件:主键
    if(data.id)
    {
        condition._id = data.id;
    }
    // 条件:单个部门ID
    if(data.departmentId)
    {
        if(Object.prototype.toString.call(data.departmentId) == '[object Array]')
        {
            condition.department_id = {$in : data.departmentId};
        }
        else
        {
            condition.department_id = data.departmentId;
        }
    }
    // 条件:多个部门ID
    if(data.departmentIds)
    {
        condition.department_id = {$in : data.departmentIds};
    }
    // 条件:部门名
    if(data.name)
    {
        condition.name = data.name;
    }
    // 条件:是否只选管理部门 (true时将只可选自己管理部门(包括子部门))
    if(data.isLeader)
    {
        condition.$or = [{department_id : {$in : global.app.user.leader_department_ids}}, {parent_department_ids : {$in : global.app.user.leader_department_ids}}];
    }

    // 获取字段

    // 排序
    const sort = data.sort || {grade : 'asc', department_id : 'desc'};

    // 获取
    let isGetAll = null;
    if(data.page)
    {
        // 分页
        const limit = parseInt(data.limit) || 10;
        departments = await Department.find(condition).sort(sort).skip(limit * (data.page - 1)).limit(limit + 1);
        // 未取尽
        if(departments.length == limit + 1)
        {
            isGetAll = false;
            departments.splice(limit, 1);
        }
        else
        {
            isGetAll = true;
        }
    }
    else
    {
        departments = await Department.find(condition).sort(sort);
    }

    // 单条返回
    if((data.id || data.departmentId) && departments.length == 1)
    {
        departments = departments[0];
    }
    else
    {
        // 分页是否取尽
        if(isGetAll === true || isGetAll === false)
        {
            departments = {departments, isGetAll};
        }
    }

    if(ctx.app)
    {
        Response.success(ctx, departments);
    }
    else
    {
        return departments;
    }
}

// ......
