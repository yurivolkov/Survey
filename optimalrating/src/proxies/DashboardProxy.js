import Proxy from './Proxy';
import { get } from 'helpers';

class DashboardProxy extends Proxy {
  constructor() {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    super(process.env.REACT_APP_API_URL, { headers });
  };

  onError = (error) => {
    if (get(error, 'response.status') === 401) {
      localStorage.removeItem('token');
      const url = encodeURIComponent(window.location.pathname);
      window.location.replace(`/auth/login?redirect=${url}`);
    }
  };
};

export default new DashboardProxy();