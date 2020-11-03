import request from '../utils/request'

/* 
  * 获取商品评论
  * @params gid 商品id Number 
*/
export const getGoodsComments = gid => {
  return request(`/comment/info/get/${gid}`, {
    method: 'GET'
  })
}