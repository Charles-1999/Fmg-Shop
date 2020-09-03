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

// const request_data = {
//   platform: 'wap',
//   rent_mode: 2,
// };

// export default (options = { method: 'GET', data: {} }) => {
//   if (!noConsole) {
//     console.log(
//       `${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(
//         options.data
//       )}`
//     );
//   }
//   return Taro.request({
//     url: baseUrl + options.url,
//     data: {
//       ...request_data,
//       ...options.data,
//     },
//     header: {
//       'Content-Type': 'application/json',
//     },
//     method: options.method.toUpperCase(),
//   }).then(res => {
//     const { statusCode, data } = res;
//     if (statusCode >= 200 && statusCode < 300) {
//       if (!noConsole) {
//         console.log(
//           `${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`,
//           res.data
//         );
//       }
//       if (data.status !== 'ok') {
//         Taro.showToast({
//           title: `${res.data.error.message}~` || res.data.error.code,
//           icon: 'none',
//           mask: true,
//         });
//       }
//       return data;
//     } else {
//       throw new Error(`网络请求错误，状态码${statusCode}`);
//     }
//   });
// };






// import Taro from '@tarojs/taro'

// const isDev = false
// const devUrl = 'http://47.101.163.80:8083'
// const productionUrl = 'https://www.mygoodslist.com'
// const BASE_URL = isDev ? devUrl : productionUrl
// // const BASE_URL = 'http://fpy229.imwork.net'

// const setToken = token => Taro.setStorage({ key: 'token', data: token })
// const getToken = () =>
//   Taro.getStorage({ key: 'token' })
//     .then(res => res.data)
//     .catch(() => '')

// const getLoginToken = () =>
//   new Promise((resolve, reject) => {
//     Taro.login({
//       success: function(res) {
//         if (res.code) {
//           // 利用code获取登录状态
//           return fetch({
//             url: '/app/auth/loginByJsCode',
//             method: 'POST',
//             data: {
//               jsCode: res.code,
//               channel: 'weixin',
//             },
//           }).then(async loginData => {
//             await setToken(loginData.token)
//             resolve(loginData.token)
//           })
//         } else {
//           Taro.showToast({
//             title: '登录失败',
//             icon: 'none',
//             duration: 2000,
//           })
//           reject('登录失败')
//         }
//       },
//     })
//   })

// async function fetch(options) {
//   const { url, method = 'GET', data: paramsData, header } = options
//   let token = await getToken()

//   if (!token && url !== '/app/auth/loginByJsCode') {
//     token = await getLoginToken()
//   }

//   return Taro.request({
//     url: `${BASE_URL}${url}`,
//     method,
//     data: paramsData,
//     header: {
//       ...header,
//       'Content-Type': 'application/json',
//       'Mini-Token': token,
//     },
//   })
//     .then(async response => {
//       const {
//         data: { data, code },
//       } = response

//       if (code === '1005') {
//         // token失效，重新登录，后再次返回该接口
//         await getLoginToken()
//         return fetch({
//           url,
//           method,
//           data,
//           header,
//         })
//       }

//       if (code !== '0000') {
//         return Promise.reject(response.data)
//       }

//       return data
//     })
//     .catch(error => {
//       Taro.showToast({
//         title: (error && error.msg) || '接口报错，请稍后在试',
//         icon: 'none',
//         duration: 2000,
//       })
//       return Promise.reject()
//     })
// }

// export function getJSON(url, data) {
//   Taro.showLoading();
//   return Taro.request({ url: url, data: data, method: 'GET' }).then(result => {
//      Taro.hideLoading();
//      return result;
//   });
// }
// export function postJSON(url, data) {
//   Taro.showLoading();
//   return Taro.request({
//      header: {
//         'content-type': 'application/json'
//      }, url: url, data: data, method: 'POST'
//   }).then(result => {
//      Taro.hideLoading();
//      return result;
//   });
// }
// /**
//  * 配置request请求时的默认参数
//  */

// const request = extend({
// });


// export { setToken, getToken, BASE_URL, request }
// export default fetch
 