import { set } from '../global_data';
import request from '../utils/request';

//获取账户信息列表
export async function getAccountInfo(params){
  request('/account/info/list', {
    method: 'GET',
    body: params,
  });
}

/** 
  * 批量获取用户
  * @param  {Array}   ids 账号id列表
  * @return {object}  
*/
export const mgetAccountInfo = ids => {
  return request(`/account/info/_mget`, {
    body: {
      ids: Array.from(new Set(ids))
    },
    method: 'POST'
  })
}