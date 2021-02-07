import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Account, UserAvatar, Language, Notifications } from 'components';
import { useTranslation } from 'react-i18next';
import { get } from 'helpers';
import eventBus from 'plugins/eventBus';

export default ({ account }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button icon={<MenuOutlined />} type="link" className="MobileBtn" onClick={() => setVisible(true)} />
      <Drawer title={
        <>
          <UserAvatar src={get(account, 'user_details.profile_image')} />
          {get(account, 'firstname')} {get(account, 'lastname')}
        </>
      } visible={visible} onClose={() => setVisible(false)} className="MobileMenu">
        <div className="d-flex mt-20">
          {account &&
            <Notifications />
          }
          <Language isMenu />
        </div>
        {account ?
          <>
            <div onClick={() => setVisible(false)}>
              <Account account={account} isMenu />
            </div>
          </>
          :
          <div className="text-center mt-20" onClick={() => setVisible(false)}>
            <Button type="link" onClick={() => eventBus.$emit('login')}>
              {t('lbl.login')}
            </Button>
            <Button type="link" onClick={() => eventBus.$emit('register')}>
              {t('lbl.register')}
            </Button>
          </div>
        }
      </Drawer>
    </>
  );
};