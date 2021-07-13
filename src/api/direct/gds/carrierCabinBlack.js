import request from '@/utils/request'

// 查询
export function listCarrierCabinBlack(data) {
  return request({
    url: '/direct/carrier_cabin_black',
    method: 'post',
    params: data
  })
}

// 删除GDS
export function delCarrierCabinBlack(data) {
  return request({
    url: '/direct/carrier_cabin_black',
    method: 'delete',
    params: data
  })
}
