const GOOD_PLACE = {
    //商品属地
}
export default function goodplace(prestate = GOOD_PLACE, action) {
  switch (action.type) {
      case 'GOOD_PLACE':
          return { ...prestate, admireState: !prestate.admireState }
      default:
          return { ...prestate }
  }
}