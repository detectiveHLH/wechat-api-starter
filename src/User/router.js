const router = require('koa-router')();
const User = require('./controllers/User');
const Department = require('./controllers/Department');
router.prefix('/user');

/**
 * 获取成员信息
 */
router.post('/get_user_info', User.getUserInfo);

/**
 * 登录
 * @param code 钉钉免登code
 */
router.post('/pass/login', User.login);

/**
 * 同步组织架构
 */
router.get('/synchronize_users', User.synchronizeUsers);

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
router.post('/get_departments', Department.get);

module.exports = router;