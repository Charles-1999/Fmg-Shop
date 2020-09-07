import request from '../utils/request';

//获取省/市/区渲染名称
export const getAddressInfoList = params =>{
  console.log(params)
  return request('/address/info/list', {
    method: 'GET',
    body: params,
  });
}
