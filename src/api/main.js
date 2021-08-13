import { request } from '../common/request'

export const getNowTime = async (params) => {
  return request.get('/api/main/getNowTime', { params })
}

export const getPlanetResources = (params) => {
  return request.get('/api/main/getPlanetResources', { params })
}

export const getPlanetBuildQueue = async (params) => {
  return request.get('/api/main/getPlanetBuildQueue', { params })
}

export const getBuilding = async (params) => {
  return request.get('/api/main/getBuilding', { params })
}

export const getFleet = async (params) => {
  return request.get('/api/main/getFleet', { params })
}

export const getDefense = async (params) => {
  return request.get('/api/main/getDefense', { params })
}

export const getResearch = async (params) => {
  return request.get('/api/main/getResearch', { params })
}

export const addBuildingQueue = async (params) => {
  return request.post('/api/main/addBuildingQueue', params)
}

export const addResearchQueue = async (params) => {
  return request.post('/api/main/addResearchQueue', params)
}

export const addFleetQueue = async (params) => {
  return request.post('/api/main/addFleetQueue', params)
}

export const addDefenseQueue = async (params) => {
  return request.post('/api/main/addDefenseQueue', params)
}

export const deleteBuildQueue = async (params) => {
  return request.post('/api/main/deleteBuildQueue', params)
}

export const getStaratlas = async (params) => {
  return request.get('/api/main/getStaratlas', { params })
}
