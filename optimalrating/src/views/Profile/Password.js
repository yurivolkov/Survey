import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { postData } from 'store/requests/global';

export default ({ t }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const validatePassword = ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(t('msg.error_password_not_match'));
    }
  });

  const onSubmit = (values) => {
    setLoading(true);
    postData({ url: 'check-password', data: { password: values.oldPassword } }).then(() => {
      postData({ url: 'password-change', data: { password: values.password } }).then(() => {
        setLoading(false);
        form.resetFields();
        notification.success({ message: t('msg.success_password_change') });
      }).catch(() => {
        setLoading(false);
        notification.error({ message: t('msg.error_password_change') });
      });
    }).catch(() => {
      setLoading(false);
      notification.error({ message: t('msg.error_old_password_wrong') });
    });
  };

  return (
    <div className="ProfilePassword">
      <div className="content content-xs ml-0">
        <Form form={form} labelCol={{ style: { width: 140 } }} labelAlign="left" layout="horizontal" onFinish={onSubmit}>
          <Form.Item name="oldPassword" label={t('lbl.old_password')} rules={[{ required: true, message: t('msg.required_password') }]}>
            <Input.Password placeholder={t('lbl.old_password')} />
          </Form.Item>
          <Form.Item name="password" label={t('lbl.new_password')} rules={[{ required: true, message: t('msg.required_password') }]}>
            <Input.Password placeholder={t('lbl.new_password')} />
          </Form.Item>
          <Form.Item name="confirm" label={t('lbl.confirm_password')} dependencies={['password']} rules={[
            { required: true, message: t('msg.required_confirm_password') },
            validatePassword
          ]}>
            <Input.Password placeholder={t('lbl.confirm_password')} />
          </Form.Item>
          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('lbl.save')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};