import Proxy from './Proxy';

class CityProxy extends Proxy {
  constructor(parameters = {}) {
    super('cities', parameters);
  }
  all(){
    return this.submit('get', `/cities`);
  }
  getAllCitiesWithCountryId(id){
    return this.submit('get', `/cities/country/${id}`);
  }
  createCityWithCountryAdmin(data){
    return this.submit('post', `/cities/country`, data);
  }
}

export default CityProxy;
