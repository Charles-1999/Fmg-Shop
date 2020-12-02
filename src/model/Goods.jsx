import { get } from 'lodash';
import  { getGoodsPlace, mgetGoodsPlace, getGoodsList, mgetGoodsList, getGoodsKind, mgetGoodsKind, mgetslideshow, getslideshow, _mgetGoodsList} from '../service/Goods';

export default {
  namespace: 'goods',
  state: {
    placeList: [],
    kindList: [],
    kindInfoList: [],
    goodsList: [],
    slideshowList:[],
    goodsSaleTopList: [],
    goodsSaleNewList: [],
    placeListIds: [],
    goodsListIds: [],
    slideshowListIds: []
  },
  effects: {
    //获取轮播图列表-------------
    * getslideshow({ payload }, { call, put }) {
      const res = yield call(getslideshow, payload);
      const info = get(res, 'slideshow',[]);
      const slideshowListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
        payload: {
          slideshowListIds: slideshowListIds
        }
      });
    },
    * getslideshowEntity({ payload }, { call, put }) {
      const res = yield call(mgetslideshow,{ payload});
      yield put({
        type: 'save',
        payload: {
          slideshowList: res
        }
      });
    },
    //获取商品属地标签-----------------
    * getGoodsPlace({ payload }, { call, put }) {
      const res = yield call(getGoodsPlace, payload);
      const info = get(res, 'tags',[]);
      const placeListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
      });
      yield put({
        type: 'getGoodsPlaceEntity',
        payload: placeListIds,
      });
    },
    //批量获取属地标签
    * getGoodsPlaceEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsPlace,{ payload});
      res.map(item => {
        if(item.picture!==""){
          item.picture = 'http://qiniu.daosuan.net/' + item.picture;
        }
        return item.picture;
      })
      yield put({
        type: 'save',
        payload: {
          placeList: res
        }
      });
    },
    //获取种类标签列表---------------------
    * getGoodsKind({ payload }, { call, put }) {
      const res = yield call(getGoodsKind, {payload});
      const info = get(res, 'tags',[]);
      // const kindListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
        payload: {
          kindList:info
        }
      });

    },
    //批量获取种类标签
    * getGoodsKindEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsKind,{ payload});
      res.map(item => {
        if(item.picture!==""){
          item.picture = 'http://qiniu.daosuan.net/' + item.picture;
        }
        return item.picture;
      })
      yield put({
        type: 'save',
        payload:{
          kindInfoList:res
        }
      });
    },
    //获取商品列表
    * getGoodsList({ payload }, { call, put }) {
      const res = yield call(getGoodsList, payload);
      const info = get(res, 'goods',[]);
      const goodsListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
        payload: {
          goodsListIds:goodsListIds
        },
      });
      // yield put({
      //   type: 'getGoodsListEntity',
      //   payload: goodsListIds,
      // });
    },
    //畅销榜
    * getGoodsTopList({ payload }, { call, put }) {
      const res = yield call(getGoodsList, payload);
      const info = get(res, 'goods',[]);
      const goodsListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
      });
      yield put({
        type: 'getGoodsTopListEntity',
        payload: goodsListIds,
      });
    },
    * getGoodsTopListEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsList,{ payload });
      res.map(item => {
        if(item.cover!==""){
          item.cover = 'http://qiniu.daosuan.net/' + item.cover;
        }
        return item;
      })
      yield put({
        type: 'save',
        payload: {
          goodsSaleTopList: res
        }
      });
    },
    //新品榜单
    * getGoodsNewList({ payload }, { call, put }) {
      const res = yield call(getGoodsList, payload);
      const info = get(res, 'goods',[]);
      const goodsListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save'
      });
      yield put({
        type: 'getGoodsNewListEntity',
        payload: goodsListIds,
      });
    },
    * getGoodsNewListEntity({ payload }, { call, put }) {
      let res = yield call(mgetGoodsList,{ payload});
      res = processGoodsList(res)
      // res.map(item => {
      //   if(item.cover!==""){
      //     item.cover = 'http://qiniu.daosuan.net/' + item.cover;
      //   }
      //   return item.cover;
      // })
      yield put({
        type: 'save',
        payload: {
          goodsSaleNewList:res
        }
      });
    },

    * getGoodsListEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsList,{ payload });
      yield put({
        type: 'save',
        payload: {
            goodsList:res
        }
      });
    },
    /* 批量获取商品信息 */
    * mgetGoodsListEntity({ payload }, { call, put }) {
      let goodsList = yield call(_mgetGoodsList, { payload })
      /* 数据处理 */
      goodsList = processGoodsList(goodsList)

      yield put({
        type: 'save',
        payload: {
          goodsList
        }
      })
    },
  },
  reducers: {
    save(state, { payload }) {
      console.log(state, payload)
      return { ...state, ...payload };
    }
  },
};

/**
 * 商品列表数据处理
 * @param {Array} goodsList
 */
function processGoodsList(goodsList) {
  goodsList.forEach(goods => {
    // 封面前缀处理
    goods.cover = 'http://qiniu.daosuan.net/' + goods.cover

    // 运费单位处理
    goods.carriage = Number(goods.carriage / 100).toFixed(2)

    // 商品是否使用促销
    const isSale = goods.sale

    /* 规格数据处理 */
    get(goods,"specification",[]).forEach(spec => {
      // 规格字符串拼接
      let arr = []
      for (let i in spec.specification) {
        arr.push(spec.specification[i])
      }
      spec.specification_text = arr.join(' ')

      // 规格价格单位处理
      spec.price = Number(spec.price / 100).toFixed(2)
      // 规格显示的价格(显示该规格的最低价)
      spec.showPrice = spec.price
      if(isSale) {
        spec.reduced_price = Number(spec.reduced_price / 100).toFixed(2)
        spec.showPrice = spec.reduced_price
      }

      // 规格图片前缀处理
      spec.picture = 'http://qiniu.daosuan.net/' + spec.picture
    })

    /* 商品列表显示的价格（显示全部规格中最低价）*/
    let min, max
    min = Math.min(...get(goods,"specification",[]).map(spec => spec.price)).toFixed(2)
    max = Math.max(...get(goods,"specification",[]).map(spec => spec.price)).toFixed(2)
    goods.showPrice = min
    // 商品原价范围处理
    if(min == max) {
      goods.unSalePriceRange = min
    } else {
      goods.unSalePriceRange = `${min}-${max}`
    }
    if(isSale) {
      min = Math.min(...get(goods,"specification",[]).map(spec => spec.reduced_price)).toFixed(2)
      max = Math.max(...get(goods,"specification",[]).map(spec => spec.reduced_price)).toFixed(2)
      goods.showPrice = min
    }

    // 商品价格范围处理
    if(min == max) {
      goods.priceRange = min
    } else {
      goods.priceRange = `${min}-${max}`
    }
  })

  return goodsList
}
