/*
 * @Author: Charles
 * @Date: 2020-11-10 19:26:50
 * @LastEditTime: 2021-01-09 23:16:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /凤鸣谷商城/src/service/Study.js
 */
import request from '@utils/request'
import { API } from '@utils/api'
import { compile } from 'path-to-regexp'
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
  return request(API.STUDY.COURSE.LIST, {
    body: params,
    method: 'GET'
  })
}

/**
 * 批量获取课程信息
 * @param {Array} ids id数组
 */
export const mgetCourseInfo = params => {
  return request(API.STUDY.COURSE.MGET, {
    body: params,
    method: 'POST'
  })
}

/**
 * 批量获取课程标签
 */
export const mgetCourseTags = params => {
  return request(API.STUDY.COURSE.TAGS, {
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
  const pattern = compile(API.STUDY.COURSE.PREAPPLY.CREATE)
  return request(pattern({ cid: params.cid }), {
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
export const getPreApplyList = (params = { page: 1, limit: 10 }) => {
  return request(API.STUDY.COURSE.PREAPPLY.LIST, {
    body: params,
    method: 'GET'
  })
}

/**
 * 批量获取预报名信息
 */
export const mgetPreApply = params => {
  return request(API.STUDY.COURSE.PREAPPLY.MGET, {
    body: params,
    method: 'POST'
  })
}

/**
 * 获取报名列表
 */
export const getApplyList = (params = { page: 1, limit: 10 }) => {
  return request(API.STUDY.COURSE.APPLY.LIST, {
    body: params,
    method: 'GET'
  })
}

/**
 * 批量获取报名信息
 */
export const mgetApply = params => {
  return request(API.STUDY.COURSE.APPLY.MGET, {
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
 * 取消报名
 * @param {Number} aid 报名id
 */
export const cancleApply = params => {
  const pattern = compile(API.STUDY.COURSE.APPLY.CANCLE)
  return request(pattern({ aid: params.aid }), {
    method: 'POST'
  })
}

/**
 * 修改预报名信息
 */
export const updatePreApply = params => {
  const pattern = compile(API.STUDY.COURSE.PREAPPLY.UPDATE)
  return request(pattern({ pid: params.pid }), {
    body: params,
    method: 'PUT'
  })
}

/**
 * 修改报名信息
 * @param {Number} aid        报名id
 * @param {Number} session_id 场次id
 */
export const updateApply = params => {
  const pattern = compile(API.STUDY.COURSE.APPLY.UPDATE)
  return request(pattern({ aid: params.aid }), {
    body: params,
    method: 'PUT'
  })
}

/**
 * 通过预报名创建报名
 */
export const preToApply = params => {
  const pattern = compile(API.STUDY.COURSE.APPLY.CREATE)
  return request(pattern({ pid: params.pid }), {
    body: params,
    method: 'POST'
  })
}

/**
 * 获取咨询列表
 */
export const getNewsList = params => {
  return request(API.STUDY.NEWS.LIST, {
    body: params,
    method: 'GET'
  })
}

/**
 * 批量获取咨询
 * @param {Array} ids
 */
export const mgetNews = params => {
  return request(API.STUDY.NEWS.MGET, {
    body: params,
    method: 'POST'
  })
}

/**
 * 退款
 * @param {Number} aid  报名id
 */
export const refund = params => {
  const pattern = compile(API.STUDY.COURSE.APPLY.REFUND)
  return request(pattern({ aid: params.aid }), {
    method: 'POST'
  })
}
