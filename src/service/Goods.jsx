import request from '../utils/request';

//批量获取属地标签
export const getGoodsPlaceEntity = params =>{
  return request('/goods/place_tag/_mget', {
    method: 'POST',
    body: params,
  });
}
//获取产品属地/goods/place_tag/_mget
export const getGoodsPlace = params =>{
  return request('/goods/place_tag/list', {
    method: 'GET',
    body: params,
  });
}
//获取种类标签列表
export async function getGoodsCategory(params){
  return request('/goods/kind_tag/list', {
    method: 'GET',
    body: params,
  });
}
//获取销售标签列表
export async function getGoodsSale(params){
  return request('/goods/sale_tag/list', {
    method: 'GET',
    body: params,
  });
}
//获取规格模版列表
export async function getGoodsSpecification(params){
  return request('/goods/sale_tag/list', {
    method: 'GET',
    body: params,
  });
}