import React, { useState } from 'react';
import { Button, Modal, Form, Input, notification, Rate } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Permission } from 'components';
import { postData } from 'store/requests/global';
import { useTranslation } from 'react-i18next';

export default ({ surveyId }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      postData({ url: `addChoice/${surveyId}`, data: values }).then(() => {
        notification.success({ message: t('msg.success_choice_add') });
        setVisible(false);
        setLoading(false);
      }).catch(() => {
        notification.error({ message: t('msg.error_choice_add') });
        setLoading(false);
      });
    });
  };

  return (
    <>
      <Permission showChild type="agreement" callback={() => setVisible(true)}>
        <Button type="link" icon={<PlusOutlined />}>
          {t('lbl.new_choice')}
        </Button>
      </Permission>
      <Modal width={600} visible={visible} title={t('lbl.add_new_option')} onOk={onSubmit} onCancel={() => setVisible(false)} okButtonProps={{ loading }}>
        <Form layout="vertical" labelAlign="left" form={form} className="d-flex" onFinish={onSubmit}>
          <Form.Item name="choice_image" className="pt-20" rules={[{ required: true, message: ' ' }]}>
            <Upload />
          </Form.Item>
          <div className="ml-10 f-1">
            <Form.Item name="choice_title" label={t('lbl.name')} rules={[{ required: true, message: t('msg.required_title') }]}>
              <Input />
            </Form.Item>
            <Form.Item name="choice_description" label={t('lbl.description')} rules={[{ required: true, message: t('msg.required_description') }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="marking" initialValue={0} label={t('lbl.rate')}>
              <Rate />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};