import axios from 'axios';
import {api} from '../utils/Api';
import axiosInstance from '../utils/Client';

const loginKakao = async params => {
  let res;
  console.log(params);
  await axios
    .get(`${api}/login/kakao`, {
      params: {accessToken: String(params)},
      withCredentials: true,
    })
    .then(response => {
      console.log(response);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.message);
    });
  return res;
};

const loginGoogle = async params => {
  let res;
  await axios
    .get(`${api}/login/google`, {
      params: {accessToken: params},
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return res;
};

const joinKakao = async (userName, nickName) => {
  console.log(userName);
  console.log(nickName);
  let res;
  await axios
    .post(`${api}/auth/sign-up/kakao`, {
      username: userName,
      provider: 'kakao',
      nickname: nickName,
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response);
    });
  return res;
};

const joinGoogle = async (userName, nickName) => {
  console.log(userName);
  console.log(nickName);
  let res;
  await axios
    .post(`${api}/auth/sign-up/google`, {
      username: userName,
      provider: 'google',
      nickname: nickName,
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response);
    });
  return res;
};

const SignInKakao = async userName => {
  console.log(userName);
  let res;
  await axios
    .post(`${api}/auth/sign-in/kakao`, {
      username: userName,
      provider: 'kakao',
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

const SignInGoogle = async userName => {
  console.log(userName);
  let res;
  await axios
    .post(`${api}/auth/sign-in/google`, {
      username: userName,
      provider: 'google',
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

const getRefreshToken = async (userName, token, refreshToken) => {
  let res;
  console.log(userName);
  await axios
    .post(`${api}/auth/refresh`, {
      username: userName,
      accessToken: token,
      refreshToken: refreshToken,
    })
    .then(response => {
      console.log(response.data);
      res = response.data;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  return res;
};

const userWithdraw = async () => {
  await axiosInstance
    .delete('/withdraw')
    .then(response => {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};

export {
  loginKakao,
  loginGoogle,
  joinKakao,
  joinGoogle,
  SignInKakao,
  SignInGoogle,
  getRefreshToken,
  userWithdraw,
};
