import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from 'store/requests/auth';
import { UserAvatar } from 'components';
import { get } from 'helpers';
import { useTranslation } from 'react-i18next';

export default ({ account, isMenu = false }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onLogout = () => {
    logout().then(() => {
      history.push('/');
    });
  };

  const AccountMenu = () => (
    <Menu>
      <Menu.Item key="settings">
        <Link to="/profile">
          <SettingOutlined className="mr-10" />
          {t('lbl.settings')}
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout}>
        <LogoutOutlined className="mr-10" />
        {t('lbl.logout')}
      </Menu.Item>
    </Menu>
  );

  return (
    isMenu ?
      <AccountMenu />
      :
      <Dropdown overlay={
        <AccountMenu />
      }>
        <Button type="link">
          <UserAvatar src={get(account, 'user_details.profile_image')} className="mr-10" />
          {account.firstname} {account.lastname}
        </Button>
      </Dropdown>
  );
};