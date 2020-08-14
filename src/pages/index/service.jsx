import request from '../../utils/request';

//获取产品属地
export async function getGoodsPlace(params){
  request('/goods/place_tag/list', {
    method: 'GET',
    body: params,
  });
}
