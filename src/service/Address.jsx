import request from '../utils/request';

//获取省/市/区渲染名称
export const getAddressInfoList = params =>{
  return request('/address/info/list', {
    method: 'GET',
    body: params,
  });
}
//获取用户所有的地址
export const getAddressInfoUid = params => {
  return request(`/address/info/${params.uid}`, {
    method: 'GET',
    
  });
}
//创建地址
export const addAddressInfo = params => {
  return request(`/address/info/${params.uid}`, {
    method: 'POST',
    body: {
      city_id: params.city_id,
      country_id: params.country_id,
      detail: params.detail,
      district_id: params.district_id,
      name: params.name,
      phone: params.phone,
      province_id: params.province_id,
    }
  });
}

export const editAddressInfo = params => {
  console.log(params);
  return request(`/address/info/${params.aid}`, {
    method: 'PUT',
    body: {
      city_id: params.city_id,
      country_id: params.country_id,
      detail: params.detail,
      district_id: params.district_id,
      name: params.name,
      phone: params.phone,
      province_id: params.province_id,
      is_deleted: params.is_deleted
    }
  });
}
//删除地址
export const deleteAddressInfo = params => {
  console.log(params)
  return request(`/address/info/delete/${params.aid}`, {
    method: 'DELETE',
    body: params,
  });
}