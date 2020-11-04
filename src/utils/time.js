export default function formatTime(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  format = format.replace('/', '-');
  format = format.replace('/', '-');
  return format;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取目标时间距离现在多久
 * @param   {Number} targetDate 目标时间
 * @returns {String} 目标时间距离现在的描述
 */
export function getToNow(targetDate) {
  /* 补全为13位 */
  let arrTimestamp = (targetDate + '').split('') // 拆分成每一个数字
  for(let i = 0; i < 13; i++) {
    if(!arrTimestamp[i])  arrTimestamp[i] = '0'
  }
  targetDate = Number(arrTimestamp.join(''))

  let minute = 1000 * 60 // 1000毫秒 * 60
  let hour = minute * 60
  let day = hour * 24
  let month = day * 30
  let now = new Date().getTime()
  /* 毫秒级的差异 */
  let diff = now - targetDate

  /* 计算差异时间的量级 */
  let monthDiff = diff / month
  let weekDiff = diff / (7 * day)
  let dayDiff = diff / day
  let hourDiff = diff / hour
  let minDiff = diff / minute

  /* 数值补0 */
  const zero = function(val) {
    return  val < 10 ? '0' + val : val
  }

  if(monthDiff > 12) {
    // 超过12个月（一年），直接显示年月日
    let date = new Date(targetDate)
    return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日'
  } else if(monthDiff >= 1) {
    return parseInt(monthDiff) + '月前'
  } else if(weekDiff >= 1) {
    return parseInt(weekDiff) + '周前'
  } else if(dayDiff >= 1) {
    return parseInt(dayDiff) + '天前'
  } else if(hourDiff >= 1) {
    return parseInt(hourDiff) + '小时前'
  } else if(minDiff >= 1) {
    return parseInt(dayDiff) + '分钟前'
  } else {
    return '刚刚'
  }
}