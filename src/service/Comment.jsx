import request from '../utils/request'

/* 获取商品评论 */
export const getGoodsComments = gid => {
  return new Promise(async(resolve, reject) => {
    let goodsComments = await request(`/comment/info/get/${gid}`, {
      method: 'GET'
    })
    // 处理图片前缀
    goodsComments.forEach(comment => {
      comment.pictures.forEach(pic => {
        pic = 'http://qiniu.daosuan.net/' + pic
      })
    })

    resolve(goodsComments)
  })
}