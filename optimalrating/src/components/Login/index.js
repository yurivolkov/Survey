import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Divider, notification } from 'antd';
import { login } from 'store/requests/auth';
import eventBus from 'plugins/eventBus';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default () => {
  const [visible, setVisible] = useState(false);
  const { loading, error } = useSelector(state => state.auth.login);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    eventBus.$on('login', () => setVisible(true));
    return () => {
      eventBus.$off('login', () => setVisible(true));
    }
  }, []);

  const onSubmit = (values) => {
    login(values).then(() => {
      notification.success({ message: t('msg.success_login') });
    });
  };

  const onForgotClick = () => {
    setVisible(false);
    eventBus.$emit('forgotPassword');
  };

  const onRegisterClick = () => {
    setVisible(false);
    eventBus.$emit('register');
  };

  return (
    <>
      <Button type="link" onClick={() => setVisible(true)}>
        {t('lbl.login')}
      </Button>
      <Modal width={340} title={t('lbl.login')} visible={visible} onCancel={() => setVisible(false)} footer={null}>
        <Form name="Login" labelAlign="left" form={form} onFinish={onSubmit}>
          <Form.Item name="email" rules={[
            { required: true, message: t('msg.required_email') },
            { type: 'email', message: t('msg.required_email') }
          ]}>
            <Input placeholder={t('lbl.email')} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('msg.required_password') }]}>
            <Input.Password placeholder={t('lbl.password')} />
          </Form.Item>
          {error &&
            <div className="text-center text-red">
              {t('msg.error_login')}
            </div>
          }
          <Button type="primary" htmlType="submit" block loading={loading}>
            {t('lbl.login')}
          </Button>
          <div className="mt-5 text-center">
            <Button type="link" className="pl-0 pr-0" onClick={onRegisterClick}>
              {t('lbl.register')}
            </Button>
          </div>
          <Divider style={{ margin: 12 }} />
          <div className="text-center">
            {t('lbl.reset_password_first')}
            <Button type="link" className="pl-0 ml-5 pr-0" onClick={onForgotClick}>
              {t('lbl.click_here')}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};