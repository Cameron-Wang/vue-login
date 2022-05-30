import { login, logout, getInfo, getSecretKey, updateUserInfo,  } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),
    nickName: '',
    userName: '',
    avatar: '',
    secretKey: '',
    userId: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NICKNAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_USERNAME: (state, userName) => {
    state.userName = userName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    console.log(state.avatar, 'state')
  },
  SET_SECRETKEY: (state, secretKey) => {
    state.secretKey = secretKey
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, passWord } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), passWord }).then(response => {
        console.log(response)
        if (!response || response.retcode !== '0000') {
          Message.error('用户登录失败')
          return
        }
        const { nickName, userName, profileUrl, userId } = response.data
        commit('SET_USERID', userId)
        commit('SET_NICKNAME', nickName)
        commit('SET_USERNAME', userName)
        commit('SET_AVATAR', profileUrl)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getSecretKey({commit}) {
    return new Promise((resolve, reject) => {
      getSecretKey().then(response => {
        const { data } = response
        commit('SET_SECRETKEY', data)
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      })
    }).catch(error => {
      reject(error)
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({userId: '', userName: ''}).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改昵称
  updateNickName({commit}, nickName) {
    return new Promise((resolve, reject) => {
      const param = {
        userId: state.userId,
        userName: state.userName,
        nickName
      }
      updateUserInfo(param).then(response => {
        if (!response || response.retcode !== '0000') {
          Message.error('修改用户头像失败')
          return
        }
        const { nickName } = response.data
        commit('SET_NICKNAME', nickName)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 设置用户头像
  updateUserProfile({commit}, avatar) {
    console.log(avatar)
    commit('SET_AVATAR', avatar)
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

