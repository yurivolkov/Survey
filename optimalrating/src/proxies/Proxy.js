import axios from 'axios';

export default class Proxy {
  constructor(baseURL = '', options = {}) {
    this.axios = axios.create({ baseURL, ...options });
  };

  submit = async ({ method, url, params, data, options }) => {
    try {
      const response = await this.axios({ method, url, params, data, ...options });
      if ((response.data.code && response.data.code !== 200 && response.data.code !== 201) || response.data.message === 'msg.info.friend_request_reject') {
        const error = response.data || 'Unknown Error';
        this.onError && this.onError(error);
        throw response.data;
      } else {
        this.onSuccess && this.onSuccess(response);
        return response.data;
      }
    } catch (e) {
      const error = e ? e.response ? e.response : e : 'Unknown Error';
      this.onError && this.onError(error);
      throw error;
    }
  };

  setHeader = (key, value) => {
    if (value) {
      this.axios.defaults.headers[key] = value;
    } else {
      delete this.axios.defaults.headers[key];
    }
  };

  getData = ({ url = '', params = {}, data = null, options = {} }) => {
    return this.submit({ method: 'get', url, params, data, options });
  };

  postData = ({ url = '', params = {}, data = null, options = {} }) => {
    return this.submit({ method: 'post', url, params, data, options });
  };

  putData = ({ url = '', params = {}, data = null, options = {} }) => {
    return this.submit({ method: 'put', url, params, data, options });
  };

  patchData = ({ url = '', params = {}, data = null, options = {} }) => {
    return this.submit({ method: 'patch', url, params, data, options });
  };

  deleteData = ({ url = '', params = {}, data = null, options = {} }) => {
    return this.submit({ method: 'delete', url, params, data, options });
  };

  headData = ({ url = '', params = {}, data = null, options = {} }) => {
    return this.submit({ method: 'head', url, params, data, options });
  };
};