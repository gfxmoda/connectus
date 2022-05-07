import axios from "axios";
import {
  ADD_POST,
  GET_ERRORS,
  POST_LOADING,
  GET_POSTS,
  GET_POST,
  DELETE_POST,
  CLEAR_ERRORS,
} from "./types";

// clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

// add post
export const addPost = (postData) => (dispatch) => {
  dispatch(clearErrors());

  axios
    .post("/api/posts", postData)
    .then((res) =>
      dispatch({
        type: ADD_POST,
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

// set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING,
  };
};

// get all posts
export const getPosts = () => (dispatch) => {
  dispatch(setPostLoading());

  axios
    .get("/api/posts")
    .then((res) =>
      dispatch({
        type: GET_POSTS,
        payload: res.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_POSTS,
        payload: null,
      })
    );
};

// get single post
export const getPost = (id) => (dispatch) => {
  dispatch(setPostLoading());

  axios
    .get(`/api/posts/${id}`)
    .then((res) =>
      dispatch({
        type: GET_POST,
        payload: res.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_POST,
        payload: null,
      })
    );
};

// add like
export const addLike = (id) => (dispatch) => {
  axios
    .post(`/api/posts/like/${id}`)
    .then((res) => dispatch(getPosts()))
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};

// remove like
export const removeLike = (id) => (dispatch) => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then((res) => dispatch(getPosts()))
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};

// add comment
export const addComment = (postId, commentData) => (dispatch) => {
  dispatch(clearErrors());

  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then((res) =>
      dispatch({
        type: GET_POST,
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

// delete comment
export const deleteComment = (postId, commentId) => (dispatch) => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then((res) =>
      dispatch({
        type: GET_POST,
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

// delete post
export const deletePost = (id) => (dispatch) => {
  axios
    .delete(`/api/posts/${id}`)
    .then((res) =>
      dispatch({
        type: DELETE_POST,
        payload: id,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      })
    );
};
