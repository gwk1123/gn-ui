import request from '@/utils/request'

// 查询OrderInfo列表
export function listOrderInput(query) {
  return request({
    url: '/order/order_input/page',
    method: 'get',
    params: query
  })
}

// 查询OrderInfo详细
export function getOrderInput(id) {
  return request({
    url: '/order/order_input/' + id,
    method: 'get'
  })
}

// 新增OrderInfo
export function addOrderInput(data) {
  return request({
    url: '/order/order_input',
    method: 'post',
    data: data
  })
}

// 修改OrderInfo
export function updateOrderInput(data) {
  return request({
    url: '/order/order_input',
    method: 'put',
    data: data
  })
}

// OrderInfo状态修改
export function changeOrderInputStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/order/order_input/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除OrderInfo
export function delOrderInput(id) {
  return request({
    url: '/order/order_input/' + id,
    method: 'delete'
  })
}
