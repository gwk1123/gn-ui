import request from '@/utils/request'

// 查询GDS列表
export function listSiteConfig(query) {
  return request({
    url: '/manual/site_config/page',
    method: 'get',
    params: query
  })
}

// 查询SiteConfig详细
export function getSiteConfig(id) {
  return request({
    url: '/manual/site_config/' + id,
    method: 'get'
  })
}

// 新增SiteConfig
export function addSiteConfig(data) {
  return request({
    url: '/manual/site_config',
    method: 'post',
    data: data
  })
}

// 修改SiteConfig
export function updateSiteConfig(data) {
  return request({
    url: '/manual/site_config',
    method: 'put',
    data: data
  })
}

// SiteConfig状态修改
export function changeSiteConfigStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/manual/site_config/change_status',
    method: 'put',
    data: data
  })
}

// 删除SiteConfig
export function delSiteConfig(id) {
  return request({
    url: '/manual/site_config/' + id,
    method: 'delete'
  })
}
