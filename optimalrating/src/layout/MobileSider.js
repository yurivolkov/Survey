import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import Sider from './Sider';
import { useTranslation } from 'react-i18next';

export default () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Button icon={<MenuUnfoldOutlined />} type="link" className="MobileSiderBtn" onClick={() => setVisible(true)} />
      <Drawer title={t('lbl.categories')} visible={visible} onClose={() => setVisible(false)} placement="left" className="MobileSider">
        <Sider t={t} isDrawer />
      </Drawer>
    </>
  );
};