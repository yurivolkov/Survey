import Proxy from './Proxy';

class categoriesProxy extends Proxy {
  constructor(parameters = {}) {
    super('categories', parameters);
  }
  getTree(){
    return this.submit('get', `/categories`);
  }
  findChild(id){
    return this.submit('get', `/categories/find_parent/${id}`);
  }
  create(payload){
    return this.submit('post', `/categories`, payload);
  }
  update(id, payload){
    return this.submit('put', `/categories/${id}`, payload);
  }
  delete(id){
    return this.submit('delete', `/categories/${id}`);
  }
  updateCategoryStatus(payload){
    return this.submit('patch', `/categories/status/${payload.id}`, {status:payload.status});
  }
  getChildren(category) {
    return this.submit('get', `/category/${category.id}`);
  }
}

export default categoriesProxy;
