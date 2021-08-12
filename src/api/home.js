import { request } from '../common/request'

export const getUniverse = async (params) => {
  return request.get('/api/home/getUniverse', { params })
}

export const getStaratlas = async (params) => {
  return request.get('/api/home/getStaratlas', { params })
}
