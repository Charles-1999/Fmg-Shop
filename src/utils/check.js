/*
 * @Author: your name
 * @Date: 2020-12-01 23:30:15
 * @LastEditTime: 2020-12-01 23:36:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /凤鸣谷商城/src/utils/check.js
 */

/**
 * 验证手机号是否合法
 * @param  {Number}  num
 * @return {Boolean}
 */
export const isValidPhone = num => {
  let reg = /^[1][3, 4, 5, 7, 8][0-9]{9}$/
  return reg.test(num)
}
