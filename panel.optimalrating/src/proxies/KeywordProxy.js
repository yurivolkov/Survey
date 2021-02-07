import Proxy from './Proxy';

class CategoryProxy extends Proxy {
  constructor(parameters = {}) {
    super('keywords', parameters);
  }
  all(){
    return this.submit('get', `/keywords`);
  }
}

export default CategoryProxy;
