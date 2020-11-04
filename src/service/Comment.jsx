import request from '../utils/request'

/**  
  * 获取商品评论
  * @param  {Number} gid 商品id
  * @return {Array}
*/
export const getGoodsComments = gid => {
  return request(`/comment/info/get/${gid}`, {
    body: {

    },
    method: 'POST'
  })
}