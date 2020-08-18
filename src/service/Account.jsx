import request from '../utils/request';

//获取账户信息列表
export async function getAccountInfo(params){
  request('/account/info/list', {
    method: 'GET',
    body: params,
  });
}
