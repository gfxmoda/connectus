import axios from "axios";
import { setAuthToken } from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};


// set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// log user out
export const logoutUser = () => dispatch => {
  // remove token from local storage
  localStorage.removeItem('jwtToken');

  // remove auth header for every future request
  setAuthToken(false); // this will execute what in the else body (which is delete)

  // set the current user to empty object so isAuthenticated will be set to false
  dispatch(setCurrentUser({})); // this will return false because type is null 
}


// Login - Get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      // save to local storage
      const { token } = res.data;
      
      // set token to local storage
      localStorage.setItem("jwtToken", token);
      
      // set token to auth header
      setAuthToken(token);

      // the token above already contins the user information. Name, ID, etc...
      // so to decode this token we will need JWTDecode module (extract the user from the very token long string )
      // Decode token to get user data
      const decoded = jwt_decode(token);

      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};
