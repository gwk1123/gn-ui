import request from '@/utils/request'

// 查询CommonPrice列表
export function listCommonPrice(query) {
  return request({
    url: '/manual/common_price/page',
    method: 'get',
    params: query
  })
}

// 查询CommonPrice详细
export function getCommonPrice(id) {
  return request({
    url: '/manual/common_price/' + id,
    method: 'get'
  })
}

// 新增CommonPrice
export function addCommonPrice(data) {
  return request({
    url: '/manual/common_price',
    method: 'post',
    data: data
  })
}

// 修改CommonPrice
export function updateCommonPrice(data) {
  return request({
    url: '/manual/common_price',
    method: 'put',
    data: data
  })
}

// CommonPrice状态修改
export function changeCommonPriceStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/manual/common_price/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除SiteConfig
export function delCommonPrice(id) {
  return request({
    url: '/manual/common_price/' + id,
    method: 'delete'
  })
}
