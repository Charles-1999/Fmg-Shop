import Taro from '@tarojs/taro';

export const apiUrl = 'http://106.52.218.85';

export const API = {
  GOODS: {
    LIST: `/goods/list`,
    MGET: `/goods/_mget`,
    PLACE: {
      LIST: `/goods/place_tag/list`,
      MGET: `/goods/place_tag/_mget`
    },
    KIND: {
      LIST: `/goods/kind_tag/list`,
      MGET: `/goods/kind_tag/_mget`
    },
    SALE: {
      LIST: `/goods/sale_tag/list`,
      MGET: `/goods/sale_tag/_mget`
    }
  },
  CART: {
    MGET: `/car/info/_mget`,
    CREATE: `/car/info/:gid`,
    UPDATE: `/car/info/put/:cid`,
    DELETE: `/car/info/delete`
  },
  ORDER: {
    LIST: `/_order/list`,
    MGET: `/_order/_mget`,
    CREATE: `/_order`,
    UPDATE: `/_order/status/:ooid/child_order/:oid`,
    DELETE: `/_order/:ooid/child_order/:oid`,
    GETPRICE: `/_order/get_price`,
    EXCHANGE: `/exchange/:ooid/:oid/:did`
  },
  STUDY: {
    COURSE: {
      LIST: `/study/course/list`,
      MGET: `/study/course/_mget`,
      TAGS: `/study/course/tag/_mget`,
      PREAPPLY: {
        CREATE: `/study/course/:cid/pre_apply`,
        LIST: `/study/course/pre_apply/list`,
        MGET: `/study/course/pre_apply/_mget`,
        UPDATE: `/study/course/pre_appy/:pid`
      },
      APPLY: {
        CREATE: `/study/course/pre_apply/:pid/apply`,
        LIST: `/study/course/apply/list`,
        MGET: `/study/course/apply/_mget`,
      }
    },
    NEWS: {
      LIST: `/news/info/list`,
      MGET: `/news/info/_mget`
    }
  },
  COMMENT: {
    CREATE: `/comment/info/:gid/:oid`,
    UPDATE: `/comment/info/:cid/:oid`,
    USER: `/comment/info/:uid`,
    GOODS: `/comment/info/get/:gid`,
    DELETE: `/comment/info/delete/:cid`
  },
  ACCOUNT: {
    LIST: `/account/info/list`,
    MGET: `/account/info/_mget`
  },
  ADDRESS: {
    CREATE: `/address/info/:uid`,
    UPDATE: `/address/info/:uid`,
    LIST: `/address/info/list`,
    MGET: `/address/info/:uid`,
    DELETE: `/address/info/delete/:aid`
  },
  ICON: {
    LIST: `/goods/icon/list`,
    MGET: `/goods/icon/_mget`
  }
}

/**
 * POST 请求
 */
export function postRequest(url, params) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: apiUrl + url,
      data: {
        ...params,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * GET 请求
 */
export function getRequest(url, params) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: apiUrl + url,
      data: {
        ...params,
      },
      method: 'GET',
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 验证非空
 */
export function verVal(val) {
  return val !== '' && typeof val !== 'undefined' && val !== null;
}

/**
 * 验证是否是对象类型
 */
export function isObj(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 延迟执行
 */
export const delayFunc = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
