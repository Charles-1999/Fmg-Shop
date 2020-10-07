import request from '../utils/request';

//订单列表
export const getOrderList = params =>{
  return request('/order/list', {
    method: 'GET',
    body: params,
  });
}

//批量获取订单信息
export const mgetOrderList = params =>{
  console.log(params)
  return request('/order/_mget', {
    method: 'POST',
    body: params,
  });
}

//修改订单信息
export const editOrderInfo = params =>{
  return request(`/order/${params.oid}`, {
    method: 'PUT',
    body: params,
  });
}

// //获取用户订单
// export const getUserOrder= params =>{
//   return request(`/order/${params.oid}`, {
//     method: 'GET',
//     body: params,
//   });
// }

// //
// export const updateOrderStatus= params =>{
//   return request('/order/status/:oid', {
//     method: 'PUT',
//     body: params,
//   });
// }