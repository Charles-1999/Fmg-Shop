import {get2Today} from '@utils/time'
import { compose } from 'redux'
import { get } from 'lodash';
import { getGoodsComments } from '../service/Comment'
import { mgetAccountInfo } from '../service/Account'
import { getToNow } from '../utils/time'
import  {getUserComment} from '../service/Comment'

export default {
  namespace: 'comment',
  state: {
    commentList: [],
    pictureList: [],
    goodComments: [],
    mediumComments: [],
    badComments: [],
    userCommentList: [],
    userInfo: {},
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
          }
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
        if (account) {
          comment.nickname = account.nickname
          comment.avator = account.avator
        } else {
          comment.nickname = ''
          comment.avator = ''
        }
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
    },

    //获取用户评论
    * getUserComment({ payload }, { call, put }) {
      let res = yield call(getUserComment, payload);
      console.log(res)
      let userId = [res[0].author_id]
      res = res.map(item=> {
        if(item.pictures){
          item.pictures = item.pictures.map(pic => 'http://qiniu.daosuan.net/' + pic)
        }
    
        // if(get(item,'second_pictures',[])){
        //   item.second_pictures = get(item,'second_pictures',[]).map(pic => 'http://qiniu.daosuan.net/' + pic)
        // }
        if(item.second_pictures !== ''){
          item.second_pictures = item.second_pictures.map(pic => 'http://qiniu.daosuan.net/' + pic)
        }
        if(item.pictures == ''){
          item.pictures = []
         
        }
        if(item.second_pictures == ''){
          item.second_pictures = []
        }
       
       return item;
      })
    
      /* 请求 批量获取用户信息 接口 */
      let accountList = yield call(mgetAccountInfo, userId)
      console.log(accountList)
      res.forEach(comment => {
        if (accountList) {
          comment.nickname = accountList[0].nickname
          comment.avator = accountList[0].avator
        } else {
          comment.nickname = ''
          comment.avator = ''
        }
        return comment
      })
      console.log(res)
      yield put({
        type: 'save',
        payload:{
          userCommentList:res
        },
      });
    },

  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
  }
}

