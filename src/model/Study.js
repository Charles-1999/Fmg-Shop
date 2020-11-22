/*
 * @Author: Charles
 * @Date: 2020-11-10 19:34:39
 * @LastEditTime: 2020-11-22 23:30:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /凤鸣谷商城/src/model/Study.js
 */
import { getCourseList, mgetCourseInfo, mgetCourseTags, preApply, getPreApplyList, mgetPreApply } from '../service/Study'
import { formatTimeStamp } from '@utils/time'

export default {
  namespace: 'study',
  state: {
    courseList: [],
    courseInfo: [],
    courseTags: [],
    preApplyList: []
  },
  effects: {
    /* 获取课程列表 */
    * getCourseList({ payload }, { call, put }) {
      // 获取课程ids
      const courseList = yield call(getCourseList, payload)
      const ids = courseList.courses.map(item => item.id)

      // 批量获取课程信息
      let courseInfo = yield call(mgetCourseInfo, {ids})

      /* 课程信息数据处理 */
      courseInfo.forEach(info => {
        /* 封面前缀 */
        info.cover = 'http://qiniu.daosuan.net/' + info.cover

        /* 研学日期（x年 y月 - m年 n月） */
        let startDate = new Date(formatTimeStamp(info.begin_time))
        let endDate = new Date(formatTimeStamp(info.end_time))
        // 如果是同一个月，只显示 x年 y月
        if( startDate.getFullYear() == endDate.getFullYear() && startDate.getMonth() == endDate.getMonth()) {
          info.date = `${startDate.getFullYear()}年${startDate.getMonth()+1}月`
        }else {
          info.date = `${startDate.getFullYear()}年${startDate.getMonth()+1}月-${endDate.getFullYear()}年${endDate.getMonth()+1}月`
        }

        /* 行程天数（x天） */
        let days = []
        info.session.forEach(session => {
          let startDate = new Date(formatTimeStamp(session.begin_time))
          let endDate = new Date(formatTimeStamp(session.end_time))
          let dayDiff = (endDate - startDate) / (1000 * 60 * 60 * 24)
          days.push(Math.ceil(dayDiff))
        })
        let min = Math.min(...days)
        let max = Math.max(...days)
        if (min == max) {
          info.days = `${min}天`
        } else {
          info.days = `${min}天-${max}天`
        }
      })

      yield put ({
        type: 'saveCourseList',
        payload: courseInfo // Arr[]
      })
    },
    /* 批量获取课程信息 */
    * mgetCourseInfo({ payload }, { call, put}) {
      const courseInfo = yield call(mgetCourseInfo, payload)
      yield put({
        type: 'save',
        payload: {
          courseInfo
        }
      })
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
          preApplyList: res.preApplys
        }
      })
    },
    /* 批量获取预报名信息 */
    * mgetPreApply({ payload }, { call, put }) {
      const res = yield call(mgetPreApply, payload)

      yield put({
        type: 'sava',
        payload: { }
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
    }
  }
}
