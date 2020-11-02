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

