import { compose } from 'redux'
import { getGoodsComments } from '../service/Comment'

export default {
  namespace: 'comment',
  state: {
    commentList: []
  },
  effects: {
    /* 获取商品评价 */
    * getGoodsComments({ payload }, { call, put }) {
      const commentList = yield call(getGoodsComments, payload)

      /* 图片封面前缀处理 */
      commentList.forEach(comment => {
        console.log(comment)
        comment.pictures.forEach(pic => {
          console.log(pic)
          pic = 'http://qiniu.daosuan.net/' + pic
          console.log(pic)
        })
      })

      yield put({
        type: 'save',
        payload: {
          commentList
        }
      })
      console.log('model', commentList)
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
  }
} 