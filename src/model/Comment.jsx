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
      const finalCommentList = yield commentList.map((info)=>{
        const pictures = info.pictures.map((arr)=>{
          return 'http://qiniu.daosuan.net/'+arr
        })
        return {...info,pictures };
      })
      console.log(1111,finalCommentList);

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