import Proxy from './Proxy';
import Vue from 'vue';
import axios from 'axios';


class AuthProxy extends Proxy {
  constructor(parameters = {}) {
    super('', parameters);
  }

  login({email, password}) {
    const data = {
      email,
      password,
    };
    return this.submit('post', 'login', data);
  }

  submit(requestType, url, data = null) {
    return new Promise((resolve, reject) => {
      let webUrl = process.env.WEB_API_LOCATION;

      axios.post(webUrl+url, data)
        .then(response =>{
          resolve(response.data);
        })
        .catch(()=>{
          reject();
        })
    });
  }
}

export default AuthProxy;
