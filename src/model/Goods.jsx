import { get } from 'lodash';
import  { getGoodsPlace, mgetGoodsPlace, getGoodsList, mgetGoodsList, getGoodsKind, mgetGoodsKind, mgetslideshow, getslideshow} from '../service/Goods';

export default {
  namespace: 'goods',
  state: {
    placeList: {},
    kindList: {},
    goodsList: {},
    slideshowList:{},
    goodsSaleTopList: {},
    goodsSaleNewList: {},
    placeListIds: [],
    kindListIds: [],
    goodsListIds: [],
    slideshowListIds: [],

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
          slideshowList:info
        },
      }); 
      yield put({
        type: 'getslideshowEntity',
        payload: slideshowListIds,
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
        payload: {
          placeList:info
        },
      }); 
      yield put({
        type: 'getGoodsPlaceEntity',
        payload: placeListIds,
      }); 
    },
    //批量获取属地标签  
    * getGoodsPlaceEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsPlace,{ payload});
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
      const kindListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
        payload: {
          kindList:info
        }
      });
      yield put({
        type: 'getGoodsKindEntity',
        payload: kindListIds,
      }); 
    },
    //批量获取种类标签
    * getGoodsKindEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsKind,{ payload});
      yield put({
        type: 'save',
        payload: {
          kindList: res
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
          goodsList:info
        },
      });
      yield put({
        type: 'getGoodsListEntity',
        payload: goodsListIds,
      }); 
    },
    //畅销榜
    * getGoodsTopList({ payload }, { call, put }) {
      const res = yield call(getGoodsList, payload);
      const info = get(res, 'goods',[]);
      const goodsListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
        payload: {
          goodsSaleTopList:info
        },
      });
      yield put({
        type: 'getGoodsTopListEntity',
        payload: goodsListIds,
      }); 
    },
    * getGoodsTopListEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsList,{ payload});
      yield put({
        type: 'save',
        payload: {  
          goodsSaleTopList:res
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
      const res = yield call(mgetGoodsList,{ payload});
      yield put({
        type: 'save',
        payload: {  
          goodsSaleNewList:res
        }
      }); 
    }, 
    * getGoodsTopListEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsList,{ payload});
      yield put({
        type: 'save',
        payload: {  
          goodsSaleTopList:res
        }
      }); 
    }, 
    * getGoodsListEntity({ payload }, { call, put }) {
      const res = yield call(mgetGoodsList,{ payload});
      yield put({
        type: 'save',
        payload: {  
            goodsList:res
        }
      }); 
    }, 
   
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
