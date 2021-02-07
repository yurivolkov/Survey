import Proxy from './Proxy';

class TranslationProxy extends Proxy {
  constructor(parameters = {}) {
    super('translations', parameters);
  }
}

export default TranslationProxy;
