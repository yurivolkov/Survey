import React, { useState, useEffect } from 'react';
import Layout from 'layout';
import { Loading, Error } from 'components';
import { geti18n, getData } from 'store/requests/global';
import { getAccount } from 'store/requests/auth';
import { ConfigProvider } from 'hooks';

export default () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onRefresh = () => {
    setError(false);
    Promise.all([geti18n(), getAccount()]).then(() => {
      getData({ url: 'subjects', key: 'subjects' });
      getData({ url: 'surveys/newest', key: 'newest' });
      setLoading(false);
    }).catch(() => {
      setError(true);
    });
  };

  useEffect(() => {
    Promise.all([geti18n(), getAccount()]).then(() => {
      getData({ url: 'subjects', key: 'subjects' });
      getData({ url: 'surveys/newest', key: 'newest' });
      setLoading(false);
    }).catch(() => {
      setError(true);
    });
  }, []);

  return (
    <div className="App">
      {error ?
        <Error onClick={onRefresh} />
        :
        loading ?
          <Loading className="Large" />
          :
          <ConfigProvider>
            <Layout />
          </ConfigProvider>
      }
    </div>
  );
};