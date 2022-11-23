import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

axios.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    let token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error.response);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response: AxiosResponse) {
    // Do something with response data
    // if (response.data) {
    //   console.log('vao day');
    //   return response.data;
    // }

    return response;
  },
  function (error: any) {
    if (
      error &&
      error.response &&
      error.response.status &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      localStorage.removeItem('access_token');
      // window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axios;
