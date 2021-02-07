import Proxy from './Proxy';
import DashboardProxy from './DashboardProxy';

class AuthProxy extends Proxy {
  constructor() {
    const token = localStorage.getItem('token');
    super(process.env.REACT_APP_API_URL, token ? { headers: { 'Authorization': `Bearer ${token}` } } : {});
  };

  login = async (data) => {
    try {
      const response = await this.postData({ url: 'login', data });
      this.setHeader('Authorization', `Bearer ${response.token.access_token}`);
      DashboardProxy.setHeader('Authorization', `Bearer ${response.token.access_token}`);
      localStorage.setItem('token', response.token.access_token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  register = async (data) => {
    try {
      const response = await this.postData({ url: 'register', data });
      this.setHeader('Authorization', `Bearer ${response.access_token}`);
      DashboardProxy.setHeader('Authorization', `Bearer ${response.access_token}`);
      localStorage.setItem('token', response.access_token);
      return response;
    } catch (error) {
      throw error;
    }
  };
};

export default new AuthProxy();