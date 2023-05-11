import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_KEY,
});

axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('jwt');
    config.headers.Authorization = JSON.parse(token);
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const {
      config,
      response: {status},
    } = error;

    const originalRequest = config;

    if (status === 403) {
      const username = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('jwt');
      const refreshToken = await AsyncStorage.getItem('jwtRefresh');

      try {
        console.log('재발급 API on');

        const data = await axiosInstance({
          method: 'post',
          url: '/auth/refresh',
          data: {
            username: username,
            token: JSON.parse(token),
            refreshToken: JSON.parse(refreshToken),
          },
        });

        console.log(data.data.body);

        const newToken = data.data.body.token;
        const newRefreshToken = data.data.body.refreshToken;
        console.log('newToken : ', newToken);
        console.log('newRefreshToken : ', newRefreshToken);

        originalRequest.headers = {
          Authorization: newToken,
        };

        AsyncStorage.setItem('jwt', JSON.stringify(newToken));
        AsyncStorage.setItem('jwtRefresh', JSON.stringify(newRefreshToken));

        return await axios(originalRequest);
      } catch (err) {
        console.log(err);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
