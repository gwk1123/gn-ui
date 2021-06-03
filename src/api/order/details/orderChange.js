import request from '@/utils/request'

// 查询OrderInfo列表
export function listOrderChange(query) {
  return request({
    url: '/order/order_change/page',
    method: 'get',
    params: query
  })
}

// 查询OrderInfo详细
export function getOrderChange(id) {
  return request({
    url: '/order/order_change/' + id,
    method: 'get'
  })
}

// 新增OrderInfo
export function addOrderChange(data) {
  return request({
    url: '/order/order_change',
    method: 'post',
    data: data
  })
}

// 修改OrderInfo
export function updateOrderChange(data) {
  return request({
    url: '/order/order_change',
    method: 'put',
    data: data
  })
}

// OrderInfo状态修改
export function changeOrderChangeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/order/order_change/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除OrderInfo
export function delOrderChange(id) {
  return request({
    url: '/order/order_change/' + id,
    method: 'delete'
  })
}
