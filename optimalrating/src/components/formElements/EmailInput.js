import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form, Input, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { postData } from 'store/requests/global';

export default React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    Modal.confirm({
      title: t('lbl.change_email_title'),
      icon: <ExclamationCircleOutlined />,
      content: <div>
        <div>{t('lbl.sure_change_email')}</div>
        <div className="mt-20 text-bold">{form.getFieldValue('email')}</div>
      </div>,
      onOk() {
        setLoading(true);
        postData({ url: 'email-change', data: form.getFieldsValue() }).then(() => {
          setVisible(false);
          setLoading(false);
          notification.success({ message: t('msg.success_email_change') });
        }).catch(() => {
          setLoading(false);
          notification.error({ message: t('msg.error_email_change') });
        });
      }
    });
  };

  return (
    <div className="EmailInput">
      {props.value}
      <Button type="link" onClick={() => setVisible(true)}>
        {t('lbl.change')}
      </Button>
      <Modal width={400} title={t('lbl.change_email')} visible={visible} onOk={onSubmit}
        onCancel={() => setVisible(false)} okButtonProps={{ loading }}>
        <Form form={form} onFinish={onSubmit}>
          <Form.Item name="email" rules={[
            { required: true, message: t('msg.required_email') },
            { type: 'email', message: t('msg.required_email') }
          ]}>
            <Input placeholder={t('lbl.enter_email')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});