import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import actions from 'store/actions/auth';

export default () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const getAccount = async () => {
      try {
        await dispatch(actions.getAccount());
        setLoading(false);
      } catch (error) {
        history.push('/auth/login');
      }
    };
    
    getAccount();
  });

  return loading;
};