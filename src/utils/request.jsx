import Taro from '@tarojs/taro';
// import { baseUrl, noConsole } from '../config';

export default function request(url, option) {

  console.log('url', url)
  
  const options = {
    ...option
  };
  const body = options.body;
  const _host = 'https://api.fmg.net.cn';
  return Taro.request({
    url: _host + url,
    data: body,
    header: {
      'Content-Type': 'application/json',
    },
    method: options.method.toUpperCase(),
  }).then((res) => {
   // console.log('res', res)
  //  console.log(3434)
  //  console.log(body)
    const {statusCode, data} = res;
    if (statusCode >= 200 && statusCode < 300) {
      // TODO 异常处理
      return new Promise(resolve => {
        resolve(data);
      });
      return data;
    }
  }).catch((error) => {
    console.log('error:', error)
    Taro.showToast({
      title: '请求错误，稍后再试',
      icon: 'none',
      mask: true,
    });
    return null;
  })
}

