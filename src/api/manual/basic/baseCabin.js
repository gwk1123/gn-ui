import request from '@/utils/request'

// 查询BaseCabin列表
export function listBaseCabin(query) {
  return request({
    url: '/manual/base_cabin/page',
    method: 'get',
    params: query
  })
}

// 查询BaseCabin详细
export function getBaseCabin(id) {
  return request({
    url: '/manual/base_cabin/' + id,
    method: 'get'
  })
}

// 新增BaseCabin
export function addBaseCabin(data) {
  return request({
    url: '/manual/base_cabin',
    method: 'post',
    data: data
  })
}

// 修改BaseCabin
export function updateBaseCabin(data) {
  return request({
    url: '/manual/base_cabin',
    method: 'put',
    data: data
  })
}

// BaseCabin状态修改
export function changeBaseCabinStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/manual/base_cabin/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除BaseCabin
export function delBaseCabin(id) {
  return request({
    url: '/manual/base_cabin/' + id,
    method: 'delete'
  })
}
