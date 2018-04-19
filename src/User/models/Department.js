const mongoose = require('mongoose');

// 部门基本信息
const Schema = new mongoose.Schema({
    // 部门ID
    department_id : {
        type : Number,
        required : true
    },
    // 部门名
    name : {
        type : String,
        required : true
    },
    // 父部门ID
    parent_department_id : Number,
    // 父部门ID列表  按顺序依次为其所有父部门的ID,直到根部门,如789的直接父部门ID是456,可形如[456,123,1]
    parent_department_ids : [Number],
    // 主管ID列表
    manager_user_ids : [String],
    // 等级
    grade : Number
});

module.exports = mongoose.model('user_department', Schema);
