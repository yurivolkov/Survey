import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Dropdown, Button, Spin } from 'antd';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { useGet } from 'hooks';
import eventBus from 'plugins/eventBus';
import { get, exists } from 'helpers';

export default ({ isMenu = false }) => {
  const { i18n, t } = useTranslation();
  const { data, loading } = useGet({ url: 'languages', key: 'languages', singleLoad: true });
  const code = i18n.language;
  const country = localStorage.getItem('country');
  const selected = get(data, 'result.set', []).find(x => x.code === code);

  const onClick = ({ key }) => {
    i18n.changeLanguage(key);
    eventBus.$emit('changeLanguage', key);
  };

  return (
    <Dropdown trigger={['click']} disabled={loading} overlay={
      <Menu className="LanguageMenu" onClick={onClick}>
        {get(data, 'result.set', []).filter(x => x.code !== country).map(x => (
          <Menu.Item key={x.code}>
            <img src={`${process.env.REACT_APP_CDN_URL}images/country/${x.flag}`} alt={x.name} />
            {x.name}
          </Menu.Item>
        ))}
      </Menu>
    }>
      <Button type="link" block={isMenu} className="LanguageButton">
        <Spin spinning={loading}>
          {country === 'null' || !selected?
            <>
              <GlobalOutlined className="mr-5" />
              {t('lbl.world')}
            </>
            :
            exists(selected, 'flag') ?
            <>
              <img src={`${process.env.REACT_APP_CDN_URL}images/country/${get(selected, 'flag')}`} alt={get(selected, 'name')} />
              {selected.name}
            </>
            :
            <>{selected.name}</>
          }
          <DownOutlined />
        </Spin>
      </Button>
    </Dropdown>
  );
};