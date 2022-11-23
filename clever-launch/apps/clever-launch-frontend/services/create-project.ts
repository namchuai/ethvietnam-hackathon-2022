import axios from './interceptor-axios';
import { AxiosRequestConfig } from 'axios';
import { API_URL } from '../constants';

const getPendingProject = (condition: any) => {
  const request: AxiosRequestConfig = {
    method: 'GET',
    url: `${API_URL}/projects/pending`,
    params: condition,
  };

  return axios(request);
};

const postProjectPending = (data: any) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `${API_URL}/projects/pending`,
    data: data,
  };

  return axios(request);
};

// update project pending

const updateProjectPending = (data: any) => {
  const request: AxiosRequestConfig = {
    method: 'PATCH',
    url: `${API_URL}/projects/pending`,
    data: data,
  };
  return axios(request);
};

const createProject = (data: any) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `${API_URL}/projects`,
    data: data,
  };
  return axios(request);
};

const kycUserInfo = (data: any) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `${API_URL}/users/ekyc-submit`,
    data: data,
  };
  return axios(request);
};

// reward

const getReward = (projectId: string) => {
  const request: AxiosRequestConfig = {
    method: 'GET',
    url: `${API_URL}/rewards/project/${projectId}`,
  };
  return axios(request);
};

const getRewardDetail = (rewardId: string) => {
  const request: AxiosRequestConfig = {
    method: 'GET',
    url: `${API_URL}/rewards/${rewardId}`,
  };
  return axios(request);
};

const deleteReward = (data: any) => {
  const request: AxiosRequestConfig = {
    method: 'DELETE',
    url: `${API_URL}/rewards`,
    data: data,
  };
  return axios(request);
};

const updateReward = (data: any) => {
  const request: AxiosRequestConfig = {
    method: 'PATCH',
    url: `${API_URL}/rewards`,
    data: data,
  };
  return axios(request);
};

const createReward = (data) => {
  const request: AxiosRequestConfig = {
    method: 'POST',
    url: `${API_URL}/rewards`,
    data: data,
  };
  return axios(request);
};

const getYears = () => {
  const request: AxiosRequestConfig = {
    method: 'GET',
    url: `${API_URL}/utilities/reward-delivery-years`,
  };
  return axios(request);
};

const getContries = () => {
  const request: AxiosRequestConfig = {
    method: 'GET',
    url: `${API_URL}/utilities/countries`,
  };
  return axios(request);
};

export {
  getPendingProject,
  postProjectPending,
  getReward,
  deleteReward,
  createReward,
  updateProjectPending,
  createProject,
  kycUserInfo,
  updateReward,
  getYears,
  getContries,
  getRewardDetail,
};
