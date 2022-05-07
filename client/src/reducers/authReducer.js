import { SET_CURRENT_USER } from "../actions/types";
import isEmpty from "../validation/is-Empty";

const initialState = {
  isAuthenticated: false,
  user: {},
};


// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    default:
      return state;
  }
}
