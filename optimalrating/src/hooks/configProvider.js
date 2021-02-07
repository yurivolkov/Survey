import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import en from 'antd/es/locale/en_US';
import tr from 'antd/es/locale/tr_TR';
import { getData } from 'store/requests/global';
import eventBus from 'plugins/eventBus';
import { DashboardProxy } from 'proxies';
import { Loading } from 'components';

export default ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  const locales = { en, tr };

  useEffect(() => {
    const changeLanguage = (lang) => {
      setLoading(true);
      i18n.changeLanguage(lang === 'null' ? 'en' : lang);
      moment.locale(lang === 'null' ? 'en' : lang);
      localStorage.setItem('country', lang);
      DashboardProxy.setHeader('country', lang);
      getData({ url: 'subjects', key: 'subjects' });
      getData({ url: 'surveys/newest', key: 'newest' });
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    eventBus.$on('changeLanguage', changeLanguage);
  }, [i18n]);

  return (
    <ConfigProvider locale={locales[i18n.language]}>
      {loading ?
        <Loading className="Large" />
        :
        children
      }
    </ConfigProvider>
  );
};