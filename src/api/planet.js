import { request } from '../common/request'

export const getNowTime = async (params) => {
  return request.get('/api/planet/getNowTime', { params })
}
export const getPlanetBuildQueue = async (params) => {
  return request.get('/api/planet/getPlanetBuildQueue', { params })
}

export const getPlanetBuildQueueByType = async (params) => {
  return request.get('/api/planet/getPlanetBuildQueueByType', { params })
}

export const getPlanetResources = (params) => {
  return request.get('/api/planet/getPlanetResources', { params })
}

export const getBuilding = async (params) => {
  return request.get('/api/planet/getBuilding', { params })
}

export const getFleet = async (params) => {
  return request.get('/api/planet/getFleet', { params })
}

export const getDefense = async (params) => {
  return request.get('/api/planet/getDefense', { params })
}

export const getResearch = async (params) => {
  return request.get('/api/planet/getResearch', { params })
}

export const addBuildingQueue = async (params) => {
  return request.post('/api/planet/addBuildingQueue', params)
}

export const addResearchQueue = async (params) => {
  return request.post('/api/planet/addResearchQueue', params)
}

export const deleteBuildQueue = async (params) => {
  return request.post('/api/planet/deleteBuildQueue', params)
}
