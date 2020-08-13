import {LOGIN_TYPE} from "../constants/login"
 
export const loginTypeFun = (data) => {
 return {
  type: LOGIN_TYPE,
  data: data
 }
}