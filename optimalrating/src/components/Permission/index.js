import React from 'react';
import eventBus from 'plugins/eventBus';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default ({ children, showChild, type = 'login', callback }) => {
  const user = useSelector(state => state.auth.account);
  const { t } = useTranslation();
  const history = useHistory();

  const hasPermission = () => {
    switch (type) {
      case 'login':
        return !!user;
      case 'profile':
        return user && user.status === 'approved';
      case 'agreement':
        return false;
      default:
        break;
    }
  };

  const onLogin = () => {
    eventBus.$emit('login');
  };

  const onProfile = () => {
    Modal.confirm({
      title: t('lbl.verify_profile'),
      content: t('lbl.complete_profile'),
      onOk: () => {
        history.push('profile');
      }
    });
  };

  const onAgreement = () => {
    Modal.confirm({
      title: t('lbl.terms_of_use'),
      content: t('lbl.terms_of_use_text'),
      onOk: () => {
        callback && callback();
      }
    });
  };

  const onClick = () => {
    switch (type) {
      case 'login':
        onLogin();
        break;
      case 'profile':
        if (user) {
          onProfile();
        } else {
          onLogin();
        }
        break;
      case 'agreement':
        if (!user) {
          onLogin();
        } else if (user && user.status !== 'approved') {
          onProfile();
        } else {
          onAgreement();
        }
        break;
      default:
        break;
    }
  };

  return (
    user && hasPermission() ?
      children
      :
      showChild ?
        <span onClick={onClick} className="Permission">
          {children}
        </span>
        :
        null
  );
};