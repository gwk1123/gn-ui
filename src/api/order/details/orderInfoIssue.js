import request from '@/utils/request'

// 查询OrderInfo列表
export function listOrderInfoIssue(query) {
  return request({
    url: '/order/order_info_issue/page',
    method: 'get',
    params: query
  })
}

// 查询OrderInfo详细
export function getOrderInfoIssue(id) {
  return request({
    url: '/order/order_info_issue/' + id,
    method: 'get'
  })
}

// 新增OrderInfo
export function addOrderInfoIssue(data) {
  return request({
    url: '/order/order_info_issue',
    method: 'post',
    data: data
  })
}

// 修改OrderInfo
export function updateOrderInfoIssue(data) {
  return request({
    url: '/order/order_info_issue',
    method: 'put',
    data: data
  })
}

// OrderInfo状态修改
export function changeOrderInfoIssueStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/order/order_info_issue/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除OrderInfo
export function delOrderInfoIssue(id) {
  return request({
    url: '/order/order_info_issue/' + id,
    method: 'delete'
  })
}
