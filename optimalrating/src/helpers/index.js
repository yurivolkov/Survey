import { cloneDeep, uniqBy } from 'lodash';
import { colors } from 'helpers/constants';

/**
 * Removes empty strings, arrays, objects from an object.
 */
export const clear = (payload, isSub) => {
  if (!payload || (payload && typeof payload !== 'object')) return {};
  let _payload = isSub ? payload : cloneDeep(payload);
  Object.keys(_payload).forEach(key => {
    if (_payload[key] && typeof _payload[key] === 'object') {
      clear(_payload[key], true);
      if (Object.keys(_payload[key]).length < 1) {
        delete _payload[key];
      }
    }
    else if (_payload[key] === null || _payload[key] === '') delete _payload[key];
  });
  return _payload;
};

/**
 * Gets data from an object using key values with nested support.
 */
export const get = (data, key = '', initial) => {
  if (!data || typeof data !== 'object') {
    return initial ? initial : null;
  }
  
  key = key.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
  let keys = key.split('.');

  for (var i = 0, n = keys.length; i < n; ++i) {
    var _key = keys[i];
    if (_key in data && data[_key]) {
      data = data[_key];
    } else {
      return initial ? initial : null;
    }
  }
  return data;
};

/**
 * Gets data from an object using key values with nested support.
 */
export const exists = (data, key) => {
  if (!data || !key || typeof data !== 'object') return false;
  key = key.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
  let keys = key.split('.');

  for (var i = 0, n = keys.length; i < n; ++i) {
    var _key = keys[i];
    if (_key in data && data[_key]) {
      data = data[_key];
    } else {
      return false;
    }
  }
  return !!data;
};


export const calculateSurvey = (data, isSpecial) => {
  let result = data.filter(x => isSpecial ? true : x.status === '1').map((x, i) => {
    x.votes = uniqBy(x.votes, 'user_id');
    const N = x.votes.length;
    const A = x.votes.reduce((a, b) => a + parseInt(b.mark || 0), 0) / N || 0;
    const score = isSpecial ? N : A * Math.sqrt(N / (N + Math.sqrt(N)));
    return { ...x, score: score, color: colors[i] };
  });

  const total = result.reduce((a, b) => a + b.score, 0);

  result = result.map(x => ({
    ...x,
    percent: x.score ? (x.score / total * 100).toFixed(2) : 0
  }));

  return isSpecial ? result : result.sort((a, b) => b.percent - a.percent);
};