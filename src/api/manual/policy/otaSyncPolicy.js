import request from '@/utils/request'

// 查询GDS列表
export function listOtaSyncPolicy(query) {
  return request({
    url: '/manual/ota_sync_policy/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getOtaSyncPolicy(id) {
  return request({
    url: '/manual/ota_sync_policy/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addOtaSyncPolicy(data) {
  return request({
    url: '/manual/ota_sync_policy',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateOtaSyncPolicy(data) {
  return request({
    url: '/manual/ota_sync_policy',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeOtaSyncPolicyStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/manual/ota_sync_policy/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delOtaSyncPolicy(id) {
  return request({
    url: '/manual/ota_sync_policy/' + id,
    method: 'delete'
  })
}
