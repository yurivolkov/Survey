import Proxy from './Proxy';

class SubjectProxy extends Proxy {
  constructor(parameters = {}) {
    super('subjects', parameters);
  }
  all(){
    return this.submit('get', `/subjects`);
  }
}

export default SubjectProxy;
