import request from '../utils/request';

//获取产品属地
<<<<<<< HEAD
export const getGoodsPlace = params =>{

  return request('/goods/place_tag/list', {
=======
export async function getGoodsPlace(params){
  request('/goods/place_tag/list', {
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
    method: 'GET',
    body: params,
  });
}
//获取种类标签列表
export async function getGoodsCategory(params){
<<<<<<< HEAD
  return request('/goods/kind_tag/list', {
=======
  request('/goods/kind_tag/list', {
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
    method: 'GET',
    body: params,
  });
}
//获取销售标签列表
export async function getGoodsSale(params){
<<<<<<< HEAD
  return request('/goods/sale_tag/list', {
=======
  request('/goods/sale_tag/list', {
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
    method: 'GET',
    body: params,
  });
}
//获取规格模版列表
export async function getGoodsSpecification(params){
<<<<<<< HEAD
  return request('/goods/sale_tag/list', {
=======
  request('/goods/sale_tag/list', {
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
    method: 'GET',
    body: params,
  });
}