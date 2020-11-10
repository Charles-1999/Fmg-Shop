import Taro from '@tarojs/taro'
import request from './request'

/* 统一下单 */
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
    requestPayment(res.request, order_id)
  }, err => {
    console.error(err);
  })
}

/* 发起微信支付 */
export const requestPayment = (data, order_id) => {
  Taro.requestPayment({
    timeStamp: data.timeStamp, // 时间戳
      nonceStr: data.nonceStr, // 随机字符串
      package: data.package, // 统一下单接口返回的 prepay_id
      signType: data.signType, // 签名算法
      paySign: data.paySign, // 签名
      success: res => {
        console.log('发起微信支付：' , res);
        Taro.showToast({
          title: '支付成功',
          icon: 'success',
        })
      },
      fail: err => {
        console.error(err);
        Taro.showToast({
          title: '发起微信支付失败，请重新尝试！',
          icon: 'none',
          duration: 2000
        })
      },
      complete: () => {
        // 等待showToast结束再跳转
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/cart/index',
            complete: () => {
              Taro.navigateTo({
                url: '/pages/user/Order/myOrder?status=0'
              })
            }
          })
        }, 2000)
      }
  })
}