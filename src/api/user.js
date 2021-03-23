import request from '@/utils/request'

export function login (loginForm) {
  return request({
    url: '/crm/user/login',
    method: 'post',
    params: loginForm
  })
}

export function getUsers () {
  return request({
    url: '/crm/user/getUsers',
    method: 'get'
  })
}

export function addUser (user) {
  return request({
    url: '/crm/user/addUser',
    method: 'post',
    data: user
  })
}

export function updateUser (user) {
  return request({
    url: '/crm/user/updateUser',
    method: 'post',
    data: user
  })
}

export function deleteUser (id) {
  return request({
    url: '/crm/user/deleteUser',
    method: 'post',
    params: {
      'id': id
    }
  })
}
