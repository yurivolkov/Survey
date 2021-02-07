import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, notification } from 'antd';
import { forgotPassword } from 'store/requests/auth';
import eventBus from 'plugins/eventBus';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { loading } = useSelector(state => state.auth.forgotPassword);

  useEffect(() => {
    eventBus.$on('forgotPassword', () => setVisible(true));
    return () => {
      eventBus.$off('forgotPassword', () => setVisible(true));
    };
  }, []);

  const onSubmit = (values) => {
    forgotPassword(values).then(() => {
      notification.success({ message: t('msg.success_password_reset') });
      setVisible(false);
    }).catch(() => {
      notification.error({ message: t('msg.error_password_reset') });
    });
  };

  return (
    <Modal width={340} title={t('lbl.reset_password')} visible={visible} onCancel={() => setVisible(false)} footer={null}>
      <Form name="ForgotPassword" labelAlign="left" form={form} onFinish={onSubmit}>
        <Form.Item name="user" rules={[
          { required: true, message: t('msg.required_email') },
          { type: 'email', message: t('msg.required_email') }
        ]}>
          <Input placeholder={t('lbl.email')} />
        </Form.Item>
        <Button className="mb-5" type="primary" htmlType="submit" block size="large" loading={loading}>
          {t('lbl.okay')}
        </Button>
      </Form>
    </Modal>
  );
};