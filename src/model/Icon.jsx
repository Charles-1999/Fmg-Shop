import { get } from 'lodash';
import  { getIconList, mgetIconList } from '../service/Icon';

export default {
  namespace: 'icon',
  state: {
    iconList:{},
    iconListIds:[],
  },
  effects: {
    //获取图标列表-------------
    * getIconList({ payload }, { call, put }) {
      const res = yield call(getIconList, payload);
      console.log(res)
      const info = get(res, 'icons',[]);
      const iconListIds = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
      }); 
      yield put({
        type: 'getIconListEntity',
        payload: iconListIds,
      }); 
    },
    * getIconListEntity({ payload }, { call, put }) {
      const res = yield call(mgetIconList,{ payload});
      console.log(res)
      yield put({
        type: 'save',
        payload: {
          iconList: res
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
