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