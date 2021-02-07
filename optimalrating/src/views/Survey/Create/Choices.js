import React from 'react';
import { Form, Input, Button, Rate, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Upload } from 'components';

export default ({ fields, add, remove, t, initial = 3 }) => {

  return (
    <div>
      <div className="SurveyChoices">
        {fields.map((field, index) => (
          <div key={field.key} className="SurveyChoice">
            <div className="ChoiceImage">
              <Form.Item name={[field.name, 'id']} fieldKey={[field.fieldKey, 'id']} initialValue={null} className="d-none">
                <Input />
              </Form.Item>
              <Form.Item label=" " name={[field.name, 'choice_image']} fieldKey={[field.fieldKey, 'choice_image']} rules={[{ required: true }]}>
                <Upload />
              </Form.Item>
              <Form.Item name={[field.name, 'marking']} fieldKey={[field.fieldKey, 'marking']}>
                <Rate />
              </Form.Item>
            </div>
            <div className="ChoiceInfo">
              <Form.Item label={t('lbl.name')} name={[field.name, 'choice_title']} fieldKey={[field.fieldKey, 'choice_title']}
                rules={[{ required: true, message: t('msg.required_title') }]}>
                <Input />
              </Form.Item>
              <Form.Item label={t('lbl.description')} name={[field.name, 'choice_description']} fieldKey={[field.fieldKey, 'choice_description']}
                rules={[{ required: true, message: t('msg.required_description') }]}>
                <Input.TextArea />
              </Form.Item>
            </div>
            {index >= initial &&
              <Button icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
            }
          </div>
        ))}
      </div>
      <Divider />
      <div className="text-center">
        <Button icon={<PlusOutlined />} onClick={() => add()}>
          {t('lbl.new_choice')}
        </Button>
      </div>
    </div>
  );
};