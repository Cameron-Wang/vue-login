import request from '@/utils/request'

export function getSecretKey() {
  return request({
    url: '/api/getSecretKey',
    method: 'get',
  })
}

export function login(data) {
  return request({
    url: '/api/userLogin',
    // url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/api/userinfo',
    method: 'post',
    data
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

export function updateUserProfile(data) {
  return request({
    url: '/api/updateUserProfile',
    method: 'post',
    data
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/api/updateUserInfo',
    method: 'post',
    data
  })
}
