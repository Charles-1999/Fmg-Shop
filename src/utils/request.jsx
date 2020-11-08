import Taro, { getStorageInfoSync } from '@tarojs/taro';
// import { baseUrl, noConsole } from '../config';

export default function request(url, option) {
  console.log('url', url);

  const token = Taro.getStorageSync('token');
  const options = { ...option };
  const body = options.body;
  const _host = 'https://api.fmg.net.cn';
  return new Promise((resolve, reject) => {
    Taro.request({
      url: _host + url,
      data: body,
      header: {
        'Content-Type': 'application/json',
        'api-mode': 'client',
        'api-token': token
      },
      method: options.method.toUpperCase(),
      success: res => {
        console.log('res', res)
        if(res.statusCode === 200)
          resolve(res.data)
        else 
          reject(res)
      },
      fail: err => {
        console.log('err');
        reject(err.data)
      }
    })
  })
}


/* 
  * 获取商品列表
  * @params ids 商品id数组 Array
  * @return goodsList 商品列表 Array
*/
export function getGoodsList(ids) {
  return new Promise(async(resolve, reject) => {

    let goodsList = await request(`/goods/_mget`, {
      body: {
        ids
      },
      method: 'POST'
    })
  
    goodsList.forEach(goods => {
      // 封面前缀处理
      goods.cover = 'http://qiniu.daosuan.net/' + goods.cover
  
      // 运费单位处理
      goods.carriage = Number(goods.carriage / 100).toFixed(2)
  
      // 商品是否使用促销
      const isSale = goods.sale
  
      // 每个规格的价格处理和图片前缀处理
      goods.specification.forEach(spec => {
        spec.price = Number(spec.price / 100).toFixed(2)
        // 规格显示的价格(显示该规格的最低价)
        spec.showPrice = spec.price
        if(isSale) {
          spec.reduced_price = Number(spec.reduced_price / 100).toFixed(2)
          spec.showPrice = spec.reduced_price
        }

        spec.picture = 'http://qiniu.daosuan.net/' + spec.picture
      })

      // 商品显示的价格（显示最低价）
      if(isSale) {
        goods.showPrice = Math.min(...goods.specification.map(spec => spec.reduced_price)).toFixed(2)
      } else {
        goods.showPrice = Math.min(...goods.specification.map(spec => spec.price)).toFixed(2)
      }
    })
    
    resolve(goodsList)
  })
}