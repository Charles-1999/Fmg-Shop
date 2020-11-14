import { getCourseList, mgetCourseInfo } from '../service/Study'
import { formatTimeStamp } from '@utils/time'

export default {
  namespace: 'study',
  state: {
    courseList: [],
    courseInfo: []
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
      console.log('courseInfo', courseInfo)
      yield put({
        type: 'save',
        payload: {
          courseInfo
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
    }
  }
}