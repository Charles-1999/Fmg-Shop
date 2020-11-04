import { compose } from 'redux'
import { getGoodsComments } from '../service/Comment'
import { mgetAccountInfo } from '../service/Account'

export default {
  namespace: 'comment',
  state: {
    commentList: [],
    pictureList: []
  },
  effects: {
    /* 获取商品评价 */
    * getGoodsComments({ payload }, { call, put }) {
      let pictureList = []
      let userIdList = []

      /* 请求 批量获取商品评论 接口 */
      let commentList = yield call(getGoodsComments, payload)
      console.log('commentList', commentList)

      commentList = commentList.map(comment => {
        let pictures = []
        let pic_count = 0;

        /* 存储每条评论的用户id */
        userIdList.push(comment.author_id)

        if(comment.pictures && pic_count < 4) {
          /* 图片前缀处理 */
          pictures = comment.pictures.map(pic => 'http://qiniu.daosuan.net/' + pic)
          /* 评论图片列表，只插入每条评论的第一张图片 */
          pictureList.push(pictures[0])
          pic_count++
        }

        return {...comment, pictures}
      })

      /* 请求 批量获取用户信息 接口 */
      let accountList = yield call(mgetAccountInfo, userIdList)

      commentList.forEach(comment => {
        const account = accountList.find(acc => acc.id === comment.author_id)
        comment.nickname = account.nickname
        comment.avator = account.avator
      })

      yield put({
        type: 'save',
        payload: {
          commentList,
          pictureList
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