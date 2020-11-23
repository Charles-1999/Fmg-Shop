/*
 * @Author: Charles
 * @Date: 2020-11-10 19:26:50
 * @LastEditTime: 2020-11-23 16:45:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /凤鸣谷商城/src/service/Study.js
 */
import request from '@utils/request'
/**
 * 研学模块
*/

/**
 * 获取课程列表
 * @param {String}  name        名称
 * @param {String}  place_tag   属地标签
 * @param {String}  course_tag  课程标签
 * @param {String}  kind        类型
 * @param {String}  crowd       适合人群
 * @param {String}  is_put      是否发布
 */
export const getCourseList = params => {
  return request(`/study/course/list`, {
    body: params,
    method: 'GET'
  })
}

/**
 * 批量获取课程信息
 * @param {Array} ids id数组
 */
export const mgetCourseInfo = params => {
  return request(`/study/course/_mget`, {
    body: params,
    method: 'POST'
  })
}

/**
 * 批量获取课程标签
 */
export const mgetCourseTags = params => {
  return request(`/study/course/tag/_mget`, {
    body: params,
    method: 'POST'
  })
}

/**
 * 创建预报名
 * @param   {String}  number 电话
 * @param   {String}  name   姓名
 * @return  {Number}  预报名id
 */
export const preApply = params => {
  return request(`/study/course/${params.cid}/pre_apply`, {
    body: {
      phone: params.phone,
      name: params.name,
      people: params.people,
      session_id: params.session_id
    },
    method: 'POST'
  })
}

/**
 * 获取预报名列表
 * @param   {Number}  status 状态
 */
export const getPreApplyList = (params = { page: 1, limit: 10}) => {
  return request('/study/course/pre_apply/list', {
    body: params,
    method: 'GET'
  })
}

/**
 * 批量获取预报名信息
 */
export const mgetPreApply = params => {
  return request(`/study/course/pre_apply/_mget`, {
    body: params,
    method: 'POST'
  })
}

/**
 * 获取报名列表
 */
export const getApplyList = (params = { page: 1, limit: 10}) => {
  return request('/study/course/apply/list', {
    body: params,
    method: 'GET'
  })
}

/**
 * 批量获取报名信息
 */
export const mgetApply = params => {
  return request('/study/course/apply/_mget', {
    body: params,
    method: 'POST'
  })
}

/**
 * 取消预报名
 * @param {Number} pid 预报名id
 */
export const canclePreApply = params => {
  return request(`/study/course/pre_apply/${params.pid}/cancel`, {
    method: 'POST'
  })
}

/**
 * 修改预报名信息
 */
export const updatePreApply = params => {
  return request(`/study/course/pre_apply/${params.pid}`, {
    body: params,
    method: 'PUT'
  })
}
