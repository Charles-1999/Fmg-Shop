/*
 * @Author: Charles
 * @Date: 2020-11-10 19:34:39
 * @LastEditTime: 2020-12-07 11:59:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /凤鸣谷商城/src/model/Study.js
 */
import { getCourseList, mgetCourseInfo, mgetCourseTags, preApply, getPreApplyList, mgetPreApply, getApplyList, mgetApply, canclePreApply, cancleApply, updatePreApply, updateApply, preToApply, getNewsList, mgetNews } from '../service/Study'
import { formatTimeStamp } from '@utils/time'

export default {
  namespace: 'study',
  state: {},
  effects: {
    // call     调用异步逻辑
    // put      用于触发action
    // select   用于从state中获取数据

    /* 获取课程列表 */
    * getCourseList({ payload }, { call, put }) {
      // 获取课程ids
      const courseList = yield call(getCourseList, payload)
      const ids = courseList.courses.map(item => item.id)

      // 批量获取课程信息
      yield put({
        type: 'mgetCourseInfo',
        payload: {
          ids
        }
      })
    },
    /* 批量获取课程信息 */
    * mgetCourseInfo({ payload }, { call, put }) {
      // ids 去重
      const ids = [...new Set(payload.ids)]
      payload = {...payload, ids}

      const courseInfo = yield call(mgetCourseInfo, payload)

      /* 课程信息数据处理 */
      courseInfo.forEach(info => {
        /* 封面前缀 */
        info.cover = 'http://qiniu.daosuan.net/' + info.cover

        /* 价格单位处理 */
        info.min_price = Number((info.min_price / 100).toFixed(2))

        /* 研学日期（x年 y月 - m年 n月） */
        let startDate = new Date(formatTimeStamp(info.begin_time))
        let endDate = new Date(formatTimeStamp(info.end_time))
        // 如果是同一个月，只显示 x年 y月
        if (startDate.getFullYear() == endDate.getFullYear() && startDate.getMonth() == endDate.getMonth()) {
          info.date = `${startDate.getFullYear()}年${startDate.getMonth() + 1}月`
        } else {
          info.date = `${startDate.getFullYear()}年${startDate.getMonth() + 1}月-${endDate.getFullYear()}年${endDate.getMonth() + 1}月`
        }

        /* 行程天数（x天） */
        let days = []
        info.session.forEach(session => {
          let startDate = new Date(formatTimeStamp(session.begin_time))
          let endDate = new Date(formatTimeStamp(session.end_time))
          let dayDiff = (endDate - startDate) / (1000 * 60 * 60 * 24)
          let day = Math.ceil(dayDiff)
          session.days = day
          days.push(day)

          // 价格单位处理
          session.money = Number((session.money / 100).toFixed(2))
        })
        let min = Math.min(...days)
        let max = Math.max(...days)
        if (min == max) {
          info.days = `${min}天`
        } else {
          info.days = `${min}天-${max}天`
        }
      })

      yield put({
        type: 'save',
        payload: {
          courseInfos: courseInfo
        }
      })

      return courseInfo
    },
    /* 批量获取课程标签 */
    * mgetCourseTags({ payload }, { call, put }) {
      const res = yield call(mgetCourseTags, payload)
      yield put({
        type: 'save',
        payload: {
          courseTags: res
        }
      })
    },
    /* 创建预报名 */
    * preApply({ payload }, { call, put }) {
      const res = yield call(preApply, payload)
    },
    /* 获取预报名列表 */
    * getPreApplyList({ payload }, { call, put }) {
      const res = yield call(getPreApplyList, payload)

      yield put({
        type: 'save',
        payload: {
          preApplyList: res.preApplys,
          page: res.page,
          total: res.total
        }
      })

      // 批量获取预报名信息
      yield put({
        type: 'mgetPreApply',
        payload: {
          ids: res.preApplys.map(item => item.id)
        }
      })
    },
    /* 批量获取预报名信息 */
    * mgetPreApply({ payload }, { call, put }) {
      const preApply = yield call(mgetPreApply, payload)

      preApply.forEach(item => {
        /* 订单状态 */
        let statusArr = [, '已取消', '预报名', , '已报名']
        item.status_text = statusArr[item.status]
      })

      yield put({
        type: 'save',
        payload: {
          dataList: preApply
        }
      })

      // 批量获取课程信息
      yield put({
        type: 'mgetCourseInfo',
        payload: {
          ids: preApply.map(item => item.course_id)
        }
      })
    },
    /* 获取报名列表 */
    * getApplyList({ payload }, { call, put }) {
      const res = yield call(getApplyList, payload)

      yield put({
        type: 'save',
        payload: {
          applyList: res.applys,
          page: res.page,
          total: res.total
        }
      })

      // 批量获取报名信息
      yield put({
        type: 'mgetApply',
        payload: {
          ids: res.applys.map(item => item.id)
        }
      })
    },
    /* 批量获取报名信息 */
    * mgetApply({ payload }, { call, put }) {
      const apply = yield call(mgetApply, payload)

      apply.forEach(item => {
        /* 订单状态 */
        let statusArr = [, '未支付', '已支付', , '已取消']
        item.status_text = statusArr[item.status]

        /* 订单价格 */
        item.total_price = Number((item.total_money / 100).toFixed(2))
      })

      yield put({
        type: 'save',
        payload: {
          dataList: apply
        }
      })

      // 批量获取课程信息
      yield put({
        type: 'mgetCourseInfo',
        payload: {
          ids: apply.map(item => item.course_id)
        }
      })
    },
    /* 取消预报名 */
    * canclePreApply({ payload }, { call, put }) {
      const res = yield call(canclePreApply, payload)
    },
    /* 取消报名 */
    * cancleApply({ payload }, { call, put }) {
      const res = yield call(cancleApply, payload)
    },
    /* 修改预报名信息 */
    * updatePreApply({ payload }, { call, put }) {
      const res = yield call(updatePreApply, payload)
    },
    /* 修改报名信息 */
    * updateApply({ payload }, { call, put }) {
      const res = yield call(updateApply, payload)
    },
    /* 通过预报名创建报名 */
    * preToApply({ payload }, { call, put }) {
      const res = yield call(preToApply, payload)
    },
    /* 获取咨询列表 */
    * getNewsList({ payload }, { call, put }) {
      const res = yield call(getNewsList, payload)

      yield put({
        type: 'mgetNews',
        payload: {
          ids: res.news.map(item => item.id)
        }
      })
    },
    /* 批量获取咨询 */
    * mgetNews({ payload }, { call, put}) {
      const newsList = yield call(mgetNews, payload)

      yield put({
        type: 'saveNewsList',
        payload: {
          newsList
        }
      })
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    saveCourseList(state, { payload }) { // Obj {[]}
      return {
        ...state,
        courseList: payload // []
      }
    },
    saveNewsList(state, { payload }) {
      let { newsList } = payload

      newsList.forEach(news => {
        news.cover = `http://qiniu.daosuan.net/` + news.cover
      })

      return { state, newsList }
    }
  }
}
