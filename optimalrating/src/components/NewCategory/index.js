import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form, Select, Input, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { postData } from 'store/requests/global';
import { get } from 'helpers';
import { Permission } from 'components';
import { useTranslation } from 'react-i18next';

export default () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const data = useSelector(state => state.global.tree.data);

  const onSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      postData({ url: 'userCategoryCreate', data: values }).then(() => {
        notification.success({ message: t('msg.success_category_create') });
        setLoading(false);
        setVisible(false);
      }).catch(() => {
        setLoading(false);
        notification.error({ message: t('msg.error_category_create') });
      });
    });
  };

  return (
    <>
      <div className="text-center">
        <Permission type="profile">
          <Button type="link" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            {t('lbl.new_category')}
          </Button>
        </Permission>
      </div>
      <Modal title={t('lbl.new_category')} visible={visible} onCancel={() => setVisible(false)} onOk={onSubmit} confirmLoading={loading}>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={form} onFinish={onSubmit}>
          <Form.Item name="parent" label={t('lbl.select_category')} rules={[{ required: true, message: t('msg.error_select_parent') }]}>
            <Select>
              {get(data, 'result.set', []).map(x => (
                <Select.Option key={x.id}>
                  {t(x.code)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="name" label={t('lbl.subcategory_name')} rules={[{ required: true, message: t('msg.error_enter_name') }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};