// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块中重置路由的方法
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名与头像
    name: '',
    avatar: '',
    // 菜单标记
    routes: [],
    // 按钮权限 的信息
    button: [],
    // 角色信息
    roles: [],
    // 对比【已有的异步路由，与服务器返回的标记信息进行比对信息，展示出最终要展示的路由】
    // 数组里面放对象，鉴别出是超级管理员还是普通用户， 通过计算出来。 在userInfo.data中三连环计算
    resultAsyncRoutes: [],
    // 用户最终展示的路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

//唯一修改state的地方 
const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 头像
    state.avatar = userInfo.avatar
    // 菜单权限
    state.routes = userInfo.routes
    // role
    state.roles = userInfo.roles
    // button
    state.button = userInfo.button
  },
  // 最终计算出异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // vuex保存当前用户的异步路由。注意：一个用户需要在权限内展示完整的路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户所有的路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // 给路由器添加新的路由。在菜单栏显示相应路由组件
    router.addRoutes(state.resultAllRoutes)
  }
}

// 定义一个函数，两个数组进行对比，对比出当前用户到底显示那个异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户，区分超级管理员个普通员工
  return asyncRoutes.filter(item => {
    // 数组中，没有这个元素返回的是-1，有的话就不返回-1
    if (routes.indexOf(item.name) != -1) {
      // 因为有二级函数或更多级函数，需要递归
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 解构用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  //获取用户信息 = 区分超级管理员与普通用户
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 用户的信息，包含：用户名name、用户头像avata、routes[返回的标志:不同的用户应该展示哪些菜单的标记]、roles[用户角色信息]、buttons【按钮的信息:按钮权限用的标记)
        const { data } = response
        // vuex存储用户的全部信息
        commit('SET_USERINFO', data)
        // 计算出异步路由，已有的异步路由【asyncRoutes】与服务器返回的异步路由【data.routes】进行对比。定义一个函数来比对
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

