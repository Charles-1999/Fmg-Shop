import { compose } from 'redux'
import { getGoodsComments } from '../service/Comment'

export default {
  namespace: 'comment',
  state: {
    commentList: [],
    pictureList: []
  },
  effects: {
    /* 获取商品评价 */
    * getGoodsComments({ payload }, { call, put }) {
      let commentList = yield call(getGoodsComments, payload)

      /* 图片封面前缀处理 */
      // commentList = yield commentList.map(comment => {
      //   const pictures = comment.pictures.map(pic => {
      //     return 'http://qiniu.daosuan.net/' + pic
      //   })
      //   return {...comment, pictures };
      // })

      let pictureList = []

      commentList = commentList.map(comment => {
        let pictures = []
        let pic_count = 0;
        if(comment.pictures && pic_count < 4) {
          pictures = comment.pictures.map(pic => 'http://qiniu.daosuan.net/' + pic)
          // 评论图片列表，只插入每条评论的第一张图片
          pictureList.push(pictures[0])
          pic_count++
        }
        return {...comment, pictures}
      })
      console.log(pictureList)

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