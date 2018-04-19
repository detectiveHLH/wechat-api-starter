const mongoose = require('mongoose');

// 员工基本信息
const Schema = new mongoose.Schema({
    // 员工ID
    user_id : {
        type : String,
        required : true
    },
    // 名字
    name : {
        type : String,
        required : true
    },
    // 头像
    avatar : String,
    // 电话
    mobile : String,
    // 邮箱
    email : String,
    // 所属职位ID
    user_position_id : String,
    // 所属部门ID
    department_ids : {
        type : [Number]
    },
    // 管理部门ID
    leader_department_ids : [Number],
    // access_token
    access_token : String,
    // access_token过期时间
    access_token_time : Number,
    // 入职时间
    register_time : {
        type : Number,
        required : true
    },
    // 最后登录时间
    login_time : Number,
    // 状态
    status : {
        type : Number,
        // [删除, 无效, 有效]
        enum : [-100, 0, 100],
        default : 100
    }
});

module.exports = mongoose.model('user', Schema);
