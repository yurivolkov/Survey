import React, { useEffect, useState } from 'react';
import { getData } from 'store/requests/global';
import { notification, Spin } from 'antd';
import { logout } from 'store/requests/auth';
import { useTranslation } from 'react-i18next';

export default ({ match, history }) => {
  const { t } = useTranslation();
  const { id } = match.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData({ url: `approve-delete-profile/${id}` }).then(() => {
      notification.success({ message: t('msg.success_profile_delete') });
      logout();
      history.push('/');
    }).catch(() => {
      notification.error({ message: t('msg.error_profile_delete') });
      setLoading(false);
    });
  }, [id, t, history]);

  return (
    <div className="text-center pt-50">
      <Spin spinning={loading} />
    </div>
  );
};