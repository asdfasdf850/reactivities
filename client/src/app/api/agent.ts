import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'

import { IActivity } from 'app/models/activity'
import { history } from '../../'
import { IUser, IUserFormValues } from 'app/models/user'
import { IPhoto, IProfile } from 'app/models/profile'

axios.defaults.baseURL = `http://localhost:5000/api`

axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('jwt')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

axios.interceptors.response.use(undefined, error => {
  if (error.message === 'Network error' && !error.response) {
    toast.error('Network error - make sure API is running!')
  }
  const { status, data, config } = error.response
  if (status === 404) {
    history.push('/notfound')
  }
  if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
    history.push('/notfound')
  }
  if (status === 500) {
    toast.error('Server error - check the terminal for more info!')
  }
  throw error.response
})

const responseBody = (response: AxiosResponse) => response.data

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms))

const requests = {
  get: (url: string) => axios.get(url).then(sleep(100)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(100)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(100)).then(responseBody),
  delete: (url: string) => axios.delete(url).then(sleep(100)).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData()
    formData.append('File', file)
    return axios
      .post(url, formData, {
        headers: {
          'Content-type': 'multipart/form-data'
        }
      })
      .then(responseBody)
  }
}

const Activities = {
  list: (): Promise<IActivity[]> => requests.get(`/activities`),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (IActivity: IActivity) => requests.post(`/activities`, IActivity),
  update: (IActivity: IActivity) => requests.put(`/activities/${IActivity.id}`, IActivity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.delete(`/activities/${id}/attend`)
}

const User = {
  currentUser: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login`, user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user)
}

const Profiles = {
  get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(`/photos`, photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
  delete: (id: string) => requests.delete(`/photos/${id}`)
}

export default {
  Activities,
  User,
  Profiles
}
