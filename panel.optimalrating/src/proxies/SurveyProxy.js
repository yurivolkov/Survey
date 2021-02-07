import Proxy from './Proxy';

class SurveyProxy extends Proxy {
  constructor(parameters = {}) {
    super('surveys', parameters);
  }
  pendingChoices(){
    return this.submit('get', `/pendingChoices`);
  }

  updateChoiceStatus(payload){
    return this.submit('put', `/choice/statusUpdate/${payload.id}`, {status:payload.status});
  }

  SpecialSurveyList(){
    return this.submit('get', `/surveys/special`);
  }
  SurveyList(){
    return this.submit('get', `/surveys/normal`);
  }
  create(payload){
    return this.submit('post', `/surveys`, payload);
  }

  find(id) {
    return this.submit('get', `/${this.endpoint}/detail/${id}`);
  }

  fakeVote(payload) {
    return this.submit('post', `/${this.endpoint}/fake/${payload.id}`, payload.data);
  }

  specialDateRange() {
    return this.submit('get', `/specialDateRange`);
  }

  updateSurveyStatus(payload){
    return this.submit('patch', `/surveys/status/${payload.id}`, {status:payload.status});
  }

  updateShowOnHome(payload){
    return this.submit('patch', `/surveys/show-on-home/${payload.id}`, {show_on_home:payload.show_on_home});
  }

}

export default SurveyProxy;
