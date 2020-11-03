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
    body: { ids: params.payload },
  });
}
//获取种类标签列表
export const getGoodsKind = params =>{
  console.log(params)
  return request('/goods/kind_tag/list', {
    method: 'GET',
    body: params.payload,
  });
}
//批量获取商品信息------------
export const mgetGoodsList = params =>{ 
  console.log(params.payload)
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

/* 
  * 批量获取商品信息
  * @params ids 商品id数组 Array
  * @return [Promise]
*/
export const _mgetGoodsList = ids => {
  return new Promise(async(resolve, reject) => {

    let goodsList = await request(`/goods/_mget`, {
      body: {
        ids
      },
      method: 'POST'
    })
  
    goodsList.forEach(goods => {
      // 封面前缀处理
      goods.cover = 'http://qiniu.daosuan.net/' + goods.cover
  
      // 运费单位处理
      goods.carriage = Number(goods.carriage / 100).toFixed(2)
  
      // 商品是否使用促销
      const isSale = goods.sale
  
      // 每个规格的价格处理
      goods.specification.forEach(spec => {
        spec.price = Number(spec.price / 100).toFixed(2)
        // 规格显示的价格(显示该规格的最低价)
        spec.showPrice = spec.price
        if(isSale) {
          spec.reduced_price = Number(spec.reduced_price / 100).toFixed(2)
          spec.showPrice = spec.reduced_price
        }
      })

      // 商品显示的价格（显示最低价）
      if(isSale) {
        goods.showPrice = Math.min(...goods.specification.map(spec => spec.reduced_price)).toFixed(2)
      } else {
        goods.showPrice = Math.min(...goods.specification.map(spec => spec.price)).toFixed(2)
      }
    })
    
    resolve(goodsList)
  })
}