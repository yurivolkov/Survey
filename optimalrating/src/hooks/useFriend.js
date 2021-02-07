import { useSelector } from 'react-redux';
import { get } from 'helpers';

export default (id) => {
  const user = useSelector(state => state.auth.account);

  const self = user && user.id === id;
  const friend = user && id ? user.friends.find(x => x.friend.id === id) : null;
  const pending = user && id ? user.pending_request_friends.find(x => x.friend === id.toString()) : null;
  const answer = user && id ? user.pending_friends.find(x => x.user.id === id) : null;
  const type = self ? 'self' : friend ? 'friend' : pending ? 'pending' : answer ? 'answer' : 'default';

  const person = { friend, pending: get(pending, 'user'), answer };
  const list = { self: [], default: [], friend: get(user, 'friends'), pending: get(user, 'pending_request_friends'), answer: get(user, 'pending_friends') };

  return [type, person[type], list[type], list[type].indexOf(person[type])];
};