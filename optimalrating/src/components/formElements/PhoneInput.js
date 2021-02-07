import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { Button, Modal, Input, notification } from 'antd';
import { UndoOutlined, CheckCircleFilled } from '@ant-design/icons';
import { postData } from 'store/requests/global';
import { useTranslation } from 'react-i18next';

export default React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);
  const [valid, setValid] = useState(props.valid || false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState('');
  const isDisabled = valid || !value || value === props.value;

  const onChange = (val) => {
    setValue(val);
    valid && setValid(false);
  };

  const onClick = () => {
    setLoading(true);
    postData({ url: 'send-sms-verify', data: { phone_number: value } }).then(() => {
      notification.success({ message: t('msg.success_verify_sms') });
      setVisible(true);
      setLoading(false);
    }).catch(() => {
      notification.error({ message: t('msg.error_verify_sms') });
      setLoading(false);
    })
  };

  const onOk = () => {
    setLoading(true);
    postData({ url: 'check-sms-verify', data: { phone_number: value, sms_verify_code: code } }).then(() => {
      setValid(true);
      props.onChange && props.onChange(value);
      props.onSms && props.onSms(code);
      props.onValid && props.onValid(true);
      setVisible(false);
      setCode('');
      setLoading(false);
    }).catch(() => {
      notification.error({ message: t('msg.error_verify_incorrect') });
      setLoading(false);
    });
  };

  const onCancel = () => {
    setValue(props.value);
    setValid(!!props.value);
  };

  return (
    <div className="PhoneNumber">
      <PhoneInput
        country={props.country || 'tr'}
        value={value}
        onChange={onChange}
        inputProps={{id:"phone_number", name:"phone_number"}}
      />
      {valid ?
        <CheckCircleFilled className="text-green" />
        :
        <div className="Buttons">
          {value !== props.value &&
            <Button className="mr-5" icon={<UndoOutlined />} size="small" type="link" onClick={onCancel} />
          }
          <Button type="primary" size="small" onClick={onClick} disabled={isDisabled} loading={loading}>
            {t('lbl.approve')}
          </Button>
        </div>
      }
      <Modal title={t('lbl.verify_code')} visible={visible} onOk={onOk} onCancel={() => setVisible(false)} okButtonProps={{ loading, disabled: !code }}>
        <div className="mb-5">
          {t('lbl.verify_code_description')}
        </div>
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('lbl.verify_code')} />
      </Modal>
    </div>
  )
});