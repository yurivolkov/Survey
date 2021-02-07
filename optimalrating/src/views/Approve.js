import React from 'react';
import { Card, Result, Form, Row, Col, notification } from 'antd';
import { Upload } from 'components';
import { useTranslation } from 'react-i18next';
import { patchData } from 'store/requests/global';
import { useSelector } from 'react-redux';

export default () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const user = useSelector(state => state.auth.account);

  const onChange = (url, image) => {
    patchData({ url, data: { image } }).then(() => {
      notification.success({ message: t('msg.success_profile_update') });
    }).catch(() => {
      notification.error({ message: t('msg.error_profile_update') });
    });
  };

  return (
    <div className="ApproveProfile">
      <Card title={t('lbl.verify_profile')}>
        <Result
          status="warning"
          title={t('lbl.activate_account')}
          extra={
            user &&
            <Form form={form} initialValues={user} layout="vertical">
              <Row>
                <Col span={24}>
                  <div className="text-bold">{t('lbl.valid_identity')}</div>
                  <Form.Item name="national_image">
                    <Upload type="un" onChange={(e) => onChange('nationalImage', e)} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <div className="text-bold">{t('lbl.recent_picture')}</div>
                  <Form.Item name="portrait_image">
                    <Upload type="up" onChange={(e) => onChange('portraitImage', e)} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          }
        />
      </Card>
    </div>
  );
};