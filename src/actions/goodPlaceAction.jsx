const FETCH_GOOD_PLACE = 'FETCH_GOOD_PLACE';

/*
*批量获取属地标签
*/
function fetchGoodPlace(id, place){
  return {
    type: FETCH_GOOD_PLACE,
    payload: { id, place }
  }
}

export {FETCH_GOOD_PLACE,fetchGoodPlace}