import Proxy from './Proxy';

class CommentProxy extends Proxy {
  constructor(parameters = {}) {
    super('comments', parameters);
  }
  all(){
    return this.submit('get', `/comments`);
  }
}

export default CommentProxy;
