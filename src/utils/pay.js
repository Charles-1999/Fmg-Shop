import Taro from '@tarojs/taro'
import request from './request'

/* 商品-统一下单 */
export const pay = order_id => {
  const sysInfo = Taro.getStorageSync('sysInfo')
  return request(`/pay/unified/${order_id}`, {
    body: {
      body: '凤鸣谷-商城',
      // detail: '商品',
      device_info: sysInfo.model,
    },
    method: 'POST'
  }).then(res => {
    requestPayment(res.request)
  }, err => {
    console.error(err);
  })
}

/* 研学-统一下单 */
export const payApply = (aplid, succCallback, failCallback, finshCallback) => {
  const sysInfo = Taro.getStorageSync('sysInfo')
  return request(`/pay/apply/${aplid}`, {
    body: {
      body: '凤鸣谷-商城',
      detail: '研学课程',
      device_info: sysInfo.model,
    },
    method: 'POST'
  }).then(res => {
    requestPayment(res.request, succCallback, failCallback, finshCallback)
  }, err => {
    console.error(err);
  })
}

/* 发起微信支付 */
export const requestPayment = (data, succCallback, failCallback, finshCallback) => {
  Taro.requestPayment({
    timeStamp: data.timeStamp, // 时间戳
    nonceStr: data.nonceStr, // 随机字符串
    package: data.package, // 统一下单接口返回的 prepay_id
    signType: data.signType, // 签名算法
    paySign: data.paySign, // 签名
    success: res => {
      console.log('发起微信支付：', res);
      succCallback && succCallback()
    },
    fail: err => {
      console.error(err);
      Taro.showToast({
        title: '发起微信支付失败，请重新尝试！',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        failCallback && failCallback()
      }, 2000)
    },
    complete: () => {
      finshCallback && finshCallback()
    }
  })
}
