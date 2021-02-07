import React, { useEffect } from 'react';
import { Form, Input, Button, notification, Card } from 'antd';
import { resetPassword } from 'store/requests/auth';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default ({ history, match }) => {
  const [form] = Form.useForm();
  const { id } = match.params;
  const { t } = useTranslation();
  const { loading } = useSelector(state => state.auth.resetPassword);

  useEffect(() => {
    !id && history.push('/');
  }, [id, history]);

  const onSubmit = (data) => {
    resetPassword({ id, data }).then(() => {
      notification.success({ message: t('msg.success_password_change') });
      history.push('/');
    }).catch(() => {
      notification.error({ message: t('msg.error_password_change') });
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

  return (
    <Card className="ResetPassword" title={t('lbl.reset_password')}>
      <Form name="ResetPassword" layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item name="password" label={t('lbl.new_password')} rules={[{ required: true, message: t('msg.error_enter_password') }]}>
          <Input.Password placeholder={t('lbl.new_password')} />
        </Form.Item>
        <Form.Item name="confirm" label={t('lbl.confirm_password')} dependencies={['password']} rules={
          [
            { required: true, message: t('msg.error_enter_password') },
            validatePassword
          ]
        }>
          <Input.Password placeholder={t('lbl.confirm_password')} />
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('lbl.save')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};