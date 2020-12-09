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

//获取用户评论
export const getUserComment = params => {
  console.log(params)
  return request(`/comment/info/get_by_user`, {
    body: {},
    method: 'GET'
  })
}
