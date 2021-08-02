import { request } from '../common/request'

export const getUserPlanet = async (params) => {
  return request.get('/api/user/getUserPlanet', params)
}
