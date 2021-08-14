import { request } from '../common/request'

export const sendPhoneCode = async (params) => {
  return request.get('/api/user/sendPhoneCode', { params })
}

export const verifyPhoneCode = async (params) => {
  return request.get('/api/user/verifyPhoneCode', { params })
}

export const login = async (params) => {
  return request.post('/api/user/login', params)
}

export const getUserPlanet = async (params) => {
  return request.get('/api/user/getUserPlanet', { params })
}

export const updateUserPlanetId = async (params) => {
  return request.post('/api/user/updateUserPlanetId', params)
}
