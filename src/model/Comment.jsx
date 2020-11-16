import {get2Today} from '@utils/time'
import { compose } from 'redux'
import { getGoodsComments } from '../service/Comment'
import { mgetAccountInfo } from '../service/Account'
import { getToNow } from '../utils/time'

export default {
  namespace: 'comment',
  state: {
    commentList: [],
    pictureList: [],
    goodComments: [],
    mediumComments: [],
    badComments: []
  },
  effects: {
    /* 获取商品评价 */
    * getGoodsComments({ payload }, { call, put }) {
      let pictureList = []
      let userIdList = []

      /* 请求 批量获取商品评论 接口 */
      let commentList = yield call(getGoodsComments, payload)

      let pic_count = 0;
      commentList = commentList.map(comment => {
        let pictures = []

        /* 存储每条评论的用户id */
        userIdList.push(comment.author_id)

        if(comment.pictures) {
          /* 图片前缀处理 */
          pictures = comment.pictures.map(pic => 'http://qiniu.daosuan.net/' + pic)

          /* 评论图片列表，只插入每条评论的第一张图片 */
          if(pic_count < 5){
            pictureList.push(pictures[0])
            pic_count++
            console.log(pic_count)
          }
          console.log(pictureList)
        }

        /* 处理评论时间 */
        comment.toNow = getToNow(comment.create_time)
        return {...comment, pictures}
      })

      /* 请求 批量获取用户信息 接口 */
      let accountList = yield call(mgetAccountInfo, userIdList)

      commentList.forEach(comment => {
        const account = accountList.find(acc => acc.id === comment.author_id)
        /* 获取用户信息 */
        comment.nickname = account.nickname
        comment.avator = account.avator
      })

      const goodComments = commentList.filter(comment => comment.comment_tag === 1)
      const mediumComments = commentList.filter(comment => comment.comment_tag === 2)
      const badComments = commentList.filter(comment => comment.comment_tag === 3)

      yield put({
        type: 'save',
        payload: {
          commentList,
          pictureList,
          goodComments,
          mediumComments,
          badComments
        }
      })
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
  }
}

// payload: {
//  commentList: [],
//  pictureList: []
// }
