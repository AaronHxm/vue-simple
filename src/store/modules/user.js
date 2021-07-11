import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  introduction: '',
  roles: [],
  userInfo: {}
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {

    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ 'username': username.trim(), password: password }).then(
        response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          console.log('data.token',data.token)
          setToken(data.token)
          console.log('gettoken',getToken())
          localStorage.setItem('token',data.token)
          resolve()
        }).catch(error => {
        resolve()
       // reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    const that = this

    return new Promise((resolve, reject) => {
      getInfo({ 'token': state.token }).then(response => {
        const data = response.data

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const acct = data.acct

        commit('SET_NAME', acct)
        // commit('SET_AVATAR', avatar)
        commit('SET_USER_INFO', data)
        localStorage.setItem('userInfo',JSON.stringify(data))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {

    removeToken() // must remove  token  first
    localStorage.clear()


    commit('SET_USER_INFO', {})

    commit('SET_TOKEN', '')

    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      // commit('RESET_STATE')
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

