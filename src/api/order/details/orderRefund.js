import request from '@/utils/request'

// 查询OrderRefund列表
export function listOrderRefund(query) {
  return request({
    url: '/order/order_refund/page',
    method: 'get',
    params: query
  })
}

// 查询OrderRefund详细
export function getOrderRefund(id) {
  return request({
    url: '/order/order_refund/' + id,
    method: 'get'
  })
}

// 新增OrderRefund
export function addOrderRefund(data) {
  return request({
    url: '/order/order_refund',
    method: 'post',
    data: data
  })
}

// 修改OrderRefund
export function updateOrderRefund(data) {
  return request({
    url: '/order/order_refund',
    method: 'put',
    data: data
  })
}

// OrderRefund状态修改
export function changeOrderRefundStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/order/order_refund/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除OrderInfo
export function delOrderChange(id) {
  return request({
    url: '/order/order_refund/' + id,
    method: 'delete'
  })
}
