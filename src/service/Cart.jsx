import Taro from '@tarojs/taro'
import request from '@utils/request'

/* 创建购物车 */
export const createCart = params => {
  return request(`/car/info/${params.currGoods.id}`, {
    body: {
      goods_count: params.count,
      goods_specification_id: params.currGoods.specification[params.spec_index].id,
      delivery_kind: params.delivery_kind
    },
    method: 'POST'
  })
}

/* 获取购物车 */
export const getCart = params => {
  return request(`/car/info/_mget`, {
    method: 'POST'
  })
}

/* 更新购物车 */
export const updateCart = params => {
  return request(`/car/info/put/${params.id}`, {
    body: {
      goods_count: params.goods_count,
      goods_id: params.goods_id,
      goods_specification_id: params.goods_specification_id,
      check: params.is_check
    },
    method: 'PUT'
  })
}

/* 删除购物车 */
export const delCart = params => {
  return request(`/car/info/delete`, {
    body: params,
    method: 'DELETE'
  })
}
