/** 时间格式的转换 */
export const formatTime = time => {
  `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}.${pad(time.getMilliseconds(), 3)}`
 }
 
 export var globalData: any = {} // 全局公共变量
 