import request from '@/utils/request'

// 查询GDS列表
export function listRequestRecord(query) {
  return request({
    url: '/direct/request_record/page',
    method: 'get',
    params: query
  })
}
