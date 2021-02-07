import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Form, Input, Button, Divider, notification } from 'antd';
import { CategorySelect } from 'components/formElements';
import Choices from './Choices';
import { postData } from 'store/requests/global';

export default () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      choices: [
        { id: null, choice_image: '', marking: 0, choice_title: '', choice_description: '' },
        { id: null, choice_image: '', marking: 0, choice_title: '', choice_description: '' },
        { id: null, choice_image: '', marking: 0, choice_title: '', choice_description: '' },
      ]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (values) => {
    setLoading(true);
    postData({ url: 'surveys', data: { ...values, type: 'normal' } }).then(() => {
      notification.success({ message: t('msg.success_survey_add') });
      setLoading(false);
    }).catch(() => {
      notification.error({ message: t('msg.error_survey_add') });
      setLoading(false);
    });
  };

  return (
    <div className="Survey">
      <Card title={t('lbl.add_survey')} bordered={false}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item name="category_id" label={t('lbl.select_category')} style={{ maxWidth: 600 }}>
            <CategorySelect />
          </Form.Item>
          <Form.Item name="title" label={t('lbl.survey_title')} style={{ maxWidth: 600 }}>
            <Input />
          </Form.Item>
          <Divider>
            {t('lbl.choices')}
          </Divider>
          <Form.List name="choices">
            {(fields, { add, remove }) => (
              <Choices {...{ fields, add, remove, t, initial: 3 }} />
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('lbl.save')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
};