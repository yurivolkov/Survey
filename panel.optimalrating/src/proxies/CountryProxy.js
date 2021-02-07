import Proxy from './Proxy';

class CountryProxy extends Proxy {
  constructor(parameters = {}) {
    super('countries', parameters);
  }
  all(){
    return this.submit('get', `/countries`);
  }

  updateCountryPassword(id, data) {
    return this.submit('put', `/countries/${id}`, data);
  }
}

export default CountryProxy;
