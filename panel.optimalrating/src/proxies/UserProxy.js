import Proxy from './Proxy';

class UserProxy extends Proxy {
  constructor(parameters = {}) {
    super('users', parameters);
  }

  patch(id, data) {
    return this.submit('patch', `/${this.endpoint}/upgrade/${id}`, data);
  }

  getUser(id){
    return this.submit('get', `/users/${id}`);
  }

  getAllUsers(){
    return this.submit('get', `/users`);
  }

  addUser(payload){
    return this.submit('post', `/user`, payload);
  }

  updateUser(id, payload){
    return this.submit('put', `/user/${id}`, payload);
  }

  deleteUser(id){
    return this.submit('delete', `/user/${id}`);
  }

  updateUserPassword(id, payload){
    return this.submit('put', `/user/${id}/password`, payload);
  }

}

export default UserProxy;
