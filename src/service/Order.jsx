import Taro from '@tarojs/taro'
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

/* 创建订单 */
export const createOrder = params => {
  return request(`/_order`, {
    body: {
      address_id: params.address_id,
      goods_list: params.goods_list
    },
    method: 'POST'
  })
}

/* 获取价格信息 */
export const getPrice = params => {
  return request(`/_order/get_price`, {
    body: params,
    method: 'POST'
  })
}

//退换货
export const exchangeOrder = params => {
  return request(`/exchange/${params.ooId}/${params.oId}/${params.dId}`, {
    body: params,
    method: 'POST'
  })
}

//获取订单个数
export const getOrderSum = params => {
  return request(`/_order/list/sum`, {
    body: params,
    method: 'GET'
  })
}

//获取退款list
export const getExchangeList = params => {
  return request(`/exchange/list?author_id=${params.uid}`, {
    method: 'GET',
    body: {},
  })
}

//批量获取退款list
export const mgetExchangeList = params =>{
  console.log(params)
  return request('/exchange/mget', {
    method: 'POST',
    body: params,
  });
}

//批量获取订单明细
export const mgetOrderDetailList = params =>{
  console.log(params)
  return request('/_order/detail/_mget', {
    method: 'POST',
    body: params,
  });
}
