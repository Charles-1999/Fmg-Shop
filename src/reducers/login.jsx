import {LOGIN_TYPE} from "../constants/login"

const INITIAL_STATE = {
  loginType: false
}

export default function login (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_TYPE:
      return {
        ...state,
        loginType: action.data
      }
    default:
      return state
  }
}