import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Menu } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import * as Share from 'react-share';

export default ({ className = '', title = '', url = '' }) => {
  const { t } = useTranslation();
  
  return (
    <Dropdown trigger={['click']} overlay={
      <Menu className="ShareMenu">
        <Menu.Item>
          <Share.EmailShareButton title={title} url={url}>
            <Share.EmailIcon size={20} round /> {t('lbl.email')}
          </Share.EmailShareButton>
        </Menu.Item>
        <Menu.Item>
          <Share.FacebookShareButton title={title} url={url}>
            <Share.FacebookIcon size={20} round /> Facebook
          </Share.FacebookShareButton>
        </Menu.Item>
        <Menu.Item>
          <Share.TwitterShareButton title={title} url={url}>
            <Share.TwitterIcon size={20} round /> Twitter
          </Share.TwitterShareButton>
        </Menu.Item>
        <Menu.Item>
          <Share.LinkedinShareButton title={title} url={url}>
            <Share.LinkedinIcon size={20} round /> LinkedIn
          </Share.LinkedinShareButton>
        </Menu.Item>
        <Menu.Item>
          <Share.WhatsappShareButton title={title} url={url}>
            <Share.WhatsappIcon size={20} round /> WhatsApp
          </Share.WhatsappShareButton>
        </Menu.Item>
      </Menu>
    }>
      <Button className={className} icon={<ShareAltOutlined />}>
        {t('lbl.share')}
      </Button>
    </Dropdown>
  );
};
