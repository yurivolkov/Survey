import Proxy from './Proxy';

class AccountProxy extends Proxy {
  constructor(parameters = {}) {
    super('api/account', parameters);
  }
}

export default AccountProxy;
