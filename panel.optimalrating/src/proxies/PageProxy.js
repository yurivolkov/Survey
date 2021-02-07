import Proxy from './Proxy';

class CityProxy extends Proxy {
  constructor(parameters = {}) {
    super('pages', parameters);
  }
}

export default CityProxy;
