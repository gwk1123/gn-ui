import request from '@/utils/request'

// 查询列表
export function listReservationOrder(query) {
  return request({
    url: '/direct/reservation_order/page',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getReservationOrder(id) {
  return request({
    url: '/direct/reservation_order/' + id,
    method: 'get'
  })
}
