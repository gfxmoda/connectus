import axios from "axios";
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
} from "./types";

// profile loading
const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

// clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};

// get current profile
export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());

  axios
    .get("/api/profile")
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((error) =>
      // user can create an account without the profile being set yet so we return and empty object this will fire an error
      // when the user tries to access the dashboard and will redirect him to the setting profile form
      dispatch({
        type: GET_PROFILE,
        payload: {},
      }));
};

// get profile by handle
export const getProfileByHandle = (handle) => (dispatch) => {
  dispatch(setProfileLoading());

  axios
    .get(`/api/profile/handle/${handle}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_PROFILE,
        payload: null,
      })
    );
};

// create profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post("/api/profile", profileData)
    .then((res) => history.push("/dashboard"))
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};

// add some experience
export const addExperience = (expData, history) => (dispatch) => {
  axios
    .post("/api/profile/experience", expData)
    .then((res) => history.push("dashboard"))
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};

// delete experience
export const deleteExperience = (id) => (dispatch) => {
  axios
    .delete(`/api/profile/experience/${id}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};

// add some education
export const addEducation = (eduData, history) => (dispatch) => {
  axios
    .post("/api/profile/education", eduData)
    .then((res) => history.push("dashboard"))
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};

// delete education
export const deleteEducation = (id) => (dispatch) => {
  axios.delete(`/api/profile/education/${id}`).then((res) =>
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })
  );
};

// get all profiles
export const getProfiles = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/all")
    .then((res) =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_PROFILES,
        payload: error.response.data,
      })
    );
};

// delete account & profile
export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This cannot be undone!")) {
    // this will delete the profile and the user entirely
    axios
      .delete("/api/profile")
      .then((res) =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {},
        })
      )
      .catch((error) =>
        dispatch({
          type: GET_ERRORS,
          payload: error.response.data,
        })
      ); // the empty object will set the auth to false (isAuthenticated)
  }
};
