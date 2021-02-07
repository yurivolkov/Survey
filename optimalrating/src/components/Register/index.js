import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form, Input, Row, Col, notification } from 'antd';
import { PhoneInput } from 'components/formElements';
import { register } from 'store/requests/auth';
import eventBus from 'plugins/eventBus';
import { useTranslation } from 'react-i18next';

export default () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { loading } = useSelector(state => state.auth.register);
  const country = localStorage.getItem('country');
  const [code, setCode] = useState('');

  useEffect(() => {
    eventBus.$on('register', () => setVisible(true));
    return () => {
      eventBus.$off('register', () => setVisible(true));
    }
  }, []);

  const onSubmit = (values) => {
    register({ ...values, country, sms_verify_code: code }).then(() => {
      notification.success({ message: t('msg.success_register') });
    }).catch(() => {
      notification.error({ message: t('msg.error_register') });
    });
  };

  const validatePassword = ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(t('msg.error_password_not_match'));
    }
  });

  const onLoginClick = () => {
    setVisible(false);
    eventBus.$emit('login');
  };

  return (
    <>
      <Button type="link" onClick={() => setVisible(true)}>
        {t('lbl.register')}
      </Button>
      <Modal title={t('lbl.register')} visible={visible} onCancel={() => setVisible(false)} footer={null}>
        <Form name="Login" layout="vertical" form={form} onFinish={onSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="firstname" label={t('lbl.firstname')} rules={[
                { required: true, message: t('msg.required_firstname') }
              ]}>
                <Input placeholder={t('lbl.firstname')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="middle_name" initialValue="" label={t('lbl.middle_name')}>
                <Input placeholder={t('lbl.middle_name')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="lastname" label={t('lbl.lastname')} rules={[
                { required: true, message: t('msg.required_lastname') }
              ]}>
                <Input placeholder={t('lbl.lastname')} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="phone_number" label={t('lbl.phone_number')} rules={[
                { required: true, message: t('msg.required_phone_number') }
              ]}>
                <PhoneInput country={country} onSms={(e) => setCode(e)} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="email" label={t('lbl.email')} rules={[
                { required: true, message: t('msg.required_email') },
                { type: 'email', message: t('msg.required_email') }
              ]}>
                <Input placeholder={t('lbl.email')} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="password" label={t('lbl.password')} rules={[
                { required: true, message: t('msg.required_password') }
              ]}>
                <Input.Password placeholder={t('lbl.password')} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="confirm" label={t('lbl.confirm_password')} dependencies={['password']} rules={[
                { required: true, message: t('msg.required_confirm_password') },
                validatePassword
              ]}>
                <Input.Password placeholder={t('lbl.confirm_password')} />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            {t('lbl.register')}
          </Button>
          <div className="mt-5 text-center">
            <Button type="link" className="pl-0 pr-0" onClick={onLoginClick}>
              {t('lbl.login')}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};