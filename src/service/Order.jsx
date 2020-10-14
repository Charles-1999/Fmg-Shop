import request from '../utils/request';

//订单列表
export const getOrderList = params =>{
  return request('/_order/list', {
    method: 'GET',
    body: params,
  });
}

//批量获取订单信息
export const mgetOrderList = params =>{
  console.log(params)
  return request('/_order/_mget', {
    method: 'POST',
    body: params,
  });
}

//修改子订单状态
export const editOrderInfo = params =>{
  return request(`/_order/status/${params.ooid}/child_order/${params.oid}`, {
    method: 'PUT',
    body: {
      status:params.status,
    },
  });
}

//删除子订单
export const delOrderInfo = params =>{
  return request(`/_order/:ooid/child_order/${params.oid}`, {
    method: 'DEL',
    body: params,
  });
}