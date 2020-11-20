/*
 * @Author: Charles
 * @Date: 2020-11-10 19:26:50
 * @LastEditTime: 2020-11-16 14:46:44
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
      name: params.name
    },
    method: 'POST'
  })
}
