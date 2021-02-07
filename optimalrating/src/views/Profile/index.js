import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { EyeOutlined, UserOutlined, KeyOutlined, FormOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Info from './Info';
import Friends from './Friends';
import Privacy from './Privacy';
import Password from './Password';

export default () => {
  const { t } = useTranslation();
  const [active, setActive] = useState("my_profile");

  const components = {
    my_profile: <Info t={t} />,
    friends: <Friends t={t} />,
    privacy: <Privacy t={t} />,
    password: <Password t={t} />,
  };

  const getType = (type) => {
    return active === type ? 'primary' : 'link';
  };

  return (
    <div className="User Profile">
      <div className="UserCard">
        <Card bordered={false}>
          <Button block type={getType('my_profile')} onClick={() => setActive('my_profile')} icon={<FormOutlined />}>
            {t('lbl.my_profile')}
          </Button>
          <Button block type={getType('friends')} onClick={() => setActive('friends')} icon={<UserOutlined />}>
            {t('lbl.friends')}
          </Button>
          <Button block type={getType('privacy')} onClick={() => setActive('privacy')} icon={<EyeOutlined />}>
            {t('lbl.privacy')}
          </Button>
          <Button block type={getType('password')} onClick={() => setActive('password')} icon={<KeyOutlined />}>
            {t('lbl.password')}
          </Button>
        </Card>
      </div>
      <div className="UserDetails">
        <Card title={t(`lbl.${active}`)} bordered={false}>
          {components[active]}
        </Card>
      </div>
    </div>
  );
};