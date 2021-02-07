import Proxy from './Proxy';

class SurveyChoiceProxy extends Proxy {
  constructor(parameters = {}) {
    super('surveys/choices', parameters);
  }
}

export default SurveyChoiceProxy;
