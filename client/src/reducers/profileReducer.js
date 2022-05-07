import {
  CLEAR_CURRENT_PROFILE,
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: null,
  loading: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload, // <= the data <== will be set to an empty object if the user just created an account and hasn't created his profile yet. And dashboard will be acting a bit differentely
        loading: false,
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false,
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null,
      };
    default:
      return state;
  }
}
