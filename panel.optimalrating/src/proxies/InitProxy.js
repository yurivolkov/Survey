import Proxy from './Proxy';

class InitProxy extends Proxy {
  constructor(parameters = {}) {
    super('panel-init', parameters);
  }
  dashboard(){
    return this.submit('get', `/dashboard`);
  }
}

export default InitProxy;
