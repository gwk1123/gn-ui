import request from '@/utils/request'

// 查询OrderInfo列表
export function listOrderInfo(query) {
  return request({
    url: '/order/order_info/page',
    method: 'get',
    params: query
  })
}

// 查询OrderInfo详细
export function getOrderInfo(id) {
  return request({
    url: '/order/order_info/' + id,
    method: 'get'
  })
}

// 新增OrderInfo
export function addOrderInfo(data) {
  return request({
    url: '/order/order_info',
    method: 'post',
    data: data
  })
}

// 修改OrderInfo
export function updateOrderInfo(data) {
  return request({
    url: '/order/order_info',
    method: 'put',
    data: data
  })
}

// 加解锁
export function handleOrderInfoLockFlag(id, lockFlag) {
  const data = {
    id,
    lockFlag
  }
  return request({
    url: '/order/order_info/lock_flag',
    method: 'put',
    data: data
  })
}

// 删除OrderInfo
export function delOrderInfo(id) {
  return request({
    url: '/order/order_info/' + id,
    method: 'delete'
  })
}
