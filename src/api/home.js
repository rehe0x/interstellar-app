import { request } from '../common/request'

export const getUniverse = async (params) => {
  return request.get('/api/home/getUniverse', { params })
}
