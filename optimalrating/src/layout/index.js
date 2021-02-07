import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Layout } from 'antd';
import Header from './Header';
import Sider from './Sider';
import Content from './Content';
import Footer from './Footer';

export default () => {
  const account = useSelector(state => state.auth.account);
  const { t, i18n } = useTranslation();

  return (
    <Layout className="MainLayout" lang={localStorage.getItem('country')}>
      <Layout.Header>
        <Header account={account} t={t} />
      </Layout.Header>
      <Layout>
        <Layout.Sider width={248}>
          <Sider account={account} t={t} />
        </Layout.Sider>
        <Layout className="ContentLayout">
          <Layout.Content>
            <Content t={t} i18n={i18n} />
          </Layout.Content>
          <Layout.Footer>
            <Footer t={t} />
          </Layout.Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};