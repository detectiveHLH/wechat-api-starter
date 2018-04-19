const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    // 职位名
    name : {
        type : String,
        require : true
    },
    // 关联职位ID列表

    // 新增时间
    create_time : {
        type : Number,
        required : true
    },
    // 编辑时间
    update_time : Number,
    // 状态
    status : {
        type : Number,
        // [删除, 无效, 有效]
        enum : [-100, 0, 100],
        default : 100
    }
});

module.exports = mongoose.model('user_position', Schema);
