import request from '../../utils/request';

// export const homepage = data =>
//   request({
//     url: '/homepage-v3',
//     method: 'GET',
//     data,
//   });

export const getGoodsPlace = data =>
  request({
    url: '/goods/place_tag/list',
    method: 'GET',
    data,
  });
