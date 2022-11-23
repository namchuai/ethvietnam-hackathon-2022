import axios from './interceptor-axios';
import { API_URL } from '../constants';

function getFeaturedProjects(condition) {
  const request = {
    method: 'GET',
    url: `${API_URL}/projects/featured`,
    params: condition,
  };

  return axios(request);
}

function getProjectDetail(projectId: string) {
  const request = {
    method: 'GET',
    url: `${API_URL}/projects/detail/${projectId}`,
  };

  return axios(request);
}

function getProjectBackerUser(wallet: string) {
  const request = {
    method: 'GET',
    url: `${API_URL}/user-backers/backers/${wallet}`,
  };

  return axios(request);
}

interface IProjectByUser {
  id: string;
}

function getProjectByUser(condition: IProjectByUser) {
  const request = {
    method: 'GET',
    url: `${API_URL}/projects/user`,
    params: condition,
  };

  return axios(request);
}

function getProjectInReview() {
  const request = {
    method: 'GET',
    url: `${API_URL}/projects/in-review`,
  };

  return axios(request);
}

function getProject(condition) {
  const request = {
    method: 'GET',
    url: `${API_URL}/projects`,
    params: condition,
  };

  return axios(request);
}

function getStoryProject(projectId: string) {
  const request = {
    method: 'GET',
    url: `${API_URL}/projects/story/${projectId}`,
  };

  return axios(request);
}

function getUpdateProject(projectId: string) {
  const request = {
    method: 'GET',
    url: `${API_URL}/projects/updates/${projectId}`,
  };

  return axios(request);
}

function updateProject(data: any) {
  const request = {
    method: 'POST',
    url: `${API_URL}/projects/updates`,
    data: data,
  };

  return axios(request);
}

export {
  getFeaturedProjects,
  getProject,
  getProjectInReview,
  getProjectByUser,
  getProjectDetail,
  getStoryProject,
  getUpdateProject,
  updateProject,
  getProjectBackerUser,
};
