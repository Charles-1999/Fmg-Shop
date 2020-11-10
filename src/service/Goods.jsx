import request from '../utils/request';

//批量获取轮播图信息------------
export const mgetslideshow = params =>{ 
  return request('/goods/slideshow/_mget', {
    method: 'POST',
    body: params.payload ,
  });
}
//获取轮播图列表
export const getslideshow = params =>{
  return request('/goods/slideshow/list', {
    method: 'GET',
    body: params,
  });
}
//批量获取属地标签----------
export const mgetGoodsPlace = params =>{
  return request('/goods/place_tag/_mget', {
    method: 'POST',
    body: { ids: params.payload },
  });
}
//获取产品属地/goods/place_tag/_mget
export const getGoodsPlace = params =>{
  return request('/goods/place_tag/list', {
    method: 'GET',
    body: params,
  });
}
//批量获取种类标签-----------
export const mgetGoodsKind = params =>{
  return request('/goods/kind_tag/_mget', {
    method: 'POST',
    body: params.payload,
  });
}
//获取种类标签列表
export const getGoodsKind = params =>{
  return request('/goods/kind_tag/list', {
    method: 'GET',
    body: params.payload,
  });
}
//批量获取商品信息------------
export const mgetGoodsList = params =>{ 
  if(params.payload.ids){
    return request('/goods/_mget', {
      method: 'POST',
      body: params.payload
    });
  }
  else{
    return request('/goods/_mget', {
      method: 'POST',
      body: { ids: params.payload },
    });
  }
  
}
//获取商品列表
export const getGoodsList = params =>{
  return request('/goods/list', {
    method: 'GET',
    body: params
  });
}

/** 
  * 批量获取商品信息
  * @param  {Array} ids 商品id数组
  * @return {Promise}
*/
export const _mgetGoodsList = params => {
  return request(`/goods/_mget`, {
    body: {
      ids: params.payload
    },
    method: "POST"
  })
}