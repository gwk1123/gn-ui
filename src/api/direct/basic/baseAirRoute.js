import request from '@/utils/request'

// 查询GDS列表
export function listBaseAirRoute(query) {
  return request({
    url: '/direct/base_air_route/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getBaseAirRoute(id) {
  return request({
    url: '/direct/base_air_route/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addBaseAirRoute(data) {
  return request({
    url: '/direct/base_air_route',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateBaseAirRoute(data) {
  return request({
    url: '/direct/base_air_route',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeBaseAirRouteStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/base_air_route/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delBaseAirRoute(id) {
  return request({
    url: '/direct/base_air_route/' + id,
    method: 'delete'
  })
}
