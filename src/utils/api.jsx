import Taro from '@tarojs/taro';

export const apiUrl = 'http://106.52.218.85';

export function postRequest(url, date) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: apiUrl + url,
      data: {
        ...date
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
      }
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
