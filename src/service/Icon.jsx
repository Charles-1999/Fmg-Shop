import request from '../utils/request';

//批量获取图标信息------------
export const mgetIconList = params =>{ 
  return request('/goods/icon/_mget', {
    method: 'POST',
    body: { ids: params.payload },
  });
}
//获取图标列表
export const getIconList = params =>{
  console.log(params)
  return request('/goods/icon/list', {
    method: 'GET',
    body: params,
  });
}
