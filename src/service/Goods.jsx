import request from '../utils/request';

//获取产品属地
export async function getGoodsPlace(params){
  request('/goods/place_tag/list', {
    method: 'GET',
    body: params,
  });
}
//获取种类标签列表
export async function getGoodsCategory(params){
  request('/goods/kind_tag/list', {
    method: 'GET',
    body: params,
  });
}
//获取销售标签列表
export async function getGoodsSale(params){
  request('/goods/sale_tag/list', {
    method: 'GET',
    body: params,
  });
}
//获取规格模版列表
export async function getGoodsSpecification(params){
  request('/goods/sale_tag/list', {
    method: 'GET',
    body: params,
  });
}