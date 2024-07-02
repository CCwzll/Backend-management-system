// 将四个模块的接口统一对外暴露 随后去入口文件进行引入并挂在原型上
import * as tradeMark from './product/tradMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'

// 引入权限
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'
export default {
    tradeMark,
    attr,
    spu,
    sku,
    role,
    permission,
    user
}