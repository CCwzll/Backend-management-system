// 引入axios 对axios进行二次封装
import request from '@/utils/request'
// 暴露登录接口函数
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}
// 暴露获取用户信息接口函数
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}
// 暴露退出登录接口函数
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
