import React, { useState } from 'react';
import { Form, Input, Button, Select, notification, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { ProfileModel, ProfileSaveModel } from 'helpers/models';
import { genders, educations, marital } from 'helpers/constants';
import { PhoneInput, EmailInput, TextArea, DateSelect } from 'components/formElements';
import { Upload } from 'components';
import { get } from 'helpers';
import { useGet } from 'hooks';
import { putData, getData } from 'store/requests/global';
import { updateState } from 'store/requests/auth';

export default ({ t }) => {

  const user = useSelector(state => state.auth.account);
  const languages = useSelector(state => state.global.languages.data);
  const { data: cities, loading: cityLoading } = useGet({ url: `citiesOfCountry/${user.country_id}` });
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState(user.user_details.gender)
  const [education, setEducation] = useState(user.user_details.education)
  const [phoneNumber, setPhoneNumber] = useState(user.user_details.phone_number)
  const [city, setCity] = useState(user.city_id)
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    setLoading(true);
    const data = new ProfileSaveModel(values);
    // console.log('data => ', data)
    putData({ url: 'profile', data: { user: data } }).then(() => {
      setLoading(false);
      updateState({ key: 'account', data: { ...user, ...data } });
      notification.success({ message: t('msg.success_profile_update') });
    }).catch(() => {
      setLoading(false);
      notification.error({ message: t('msg.error_profile_update') });
    });
  };

  const onDelete = () => {
    Modal.confirm({
      title: t('lbl.delete_account'),
      content: t('lbl.delete_account_text'),
      onOk: () => {
        getData({ url: 'delete-my-account' }).then(() => {
          notification.success({ message: t('msg.success_delete_account') });
        }).catch(() => {
          notification.success({ message: t('msg.error_delete_account') });
        });
      }
    });
  }

  return (
    <div className="ProfileInfo">
      <div style={{ maxWidth: 600 }}>
        <Form form={form} initialValues={new ProfileModel(user)} labelCol={{ style: { width: 160 } }} labelAlign="left" onFinish={onSubmit}>
          <Form.Item name="profile_image">
            <Upload type="us" />
          </Form.Item>
          <Form.Item name="username" label={t('lbl.username')}>
            <Input placeholder={t('lbl.username')} />
          </Form.Item>
          <Form.Item name="firstname" label={t('lbl.firstname')}>
            <Input placeholder={t('lbl.firstname')} />
          </Form.Item>
          <Form.Item name="middlename" label={t('lbl.middlename')}>
            <Input placeholder={t('lbl.middlename')} />
          </Form.Item>
          <Form.Item name="lastname" label={t('lbl.lastname')}>
            <Input placeholder={t('lbl.lastname')} />
          </Form.Item>
          <Form.Item name="birthdate" label={t('lbl.birthdate')}>
            <DateSelect />
          </Form.Item>
          {/* <DatePicker /> */}
          <Form.Item name="gender" label={t('lbl.gender')}>
            <Select options={genders.map(x => ({ label: t(x.label), value: x.value }))} className={gender? "" : "required_field"} onChange={(e) => setGender(e)} />
          </Form.Item>
          <Form.Item name="education" label={t('lbl.education')}>
            <Select options={educations.map(x => ({ label: t(x.label), value: x.value }))} className={education? "" : "required_field"} onChange={(e) => setEducation(e)} />
          </Form.Item>
          <Form.Item name="country_id" label={t('lbl.country')}>
            <Select options={get(languages, 'result.set', []).map(x => ({ label: x.name, value: x.id.toString() }))} disabled />
          </Form.Item>
          <Form.Item name="city_id" label={t('lbl.city')}>
            <Select options={get(cities, 'result.set', []).map(x => ({ label: x.name, value: x.id.toString() }))} loading={cityLoading} className={city? "" : "required_field"} onChange={(e) => setCity(e)}/>
          </Form.Item>
          <Form.Item name="phone_number" label={t('lbl.phone_number')}>
            <PhoneInput valid value={phoneNumber} onChange={(e) => setPhoneNumber(e)}/>
          </Form.Item>
          <Form.Item name="email" label={t('lbl.email')}>
            <EmailInput />
          </Form.Item>
          <Form.Item name="occupation" label={t('lbl.occupation')}>
            <Input placeholder={t('lbl.occupation')} />
          </Form.Item>
          <Form.Item name="marital_status" label={t('lbl.marital_status')}>
            <Select options={marital.map(x => ({ label: t(x.label), value: x.value }))} />
          </Form.Item>
          <Form.Item name="about" label={t('lbl.about')}>
            <TextArea placeholder={t('lbl.about')} maxLength={1000} />
          </Form.Item>
          <Form.Item name="facebook_url" label={t('lbl.facebook_url')}>
            <Input placeholder={t('lbl.facebook_url')} />
          </Form.Item>
          <Form.Item name="instagram_url" label={t('lbl.instagram_url')}>
            <Input placeholder={t('lbl.instagram_url')} />
          </Form.Item>
          <Form.Item name="twitter_url" label={t('lbl.twitter_url')}>
            <Input placeholder={t('lbl.twitter_url')} />
          </Form.Item>
          <Form.Item name="skype_url" label={t('lbl.skype_url')}>
            <Input placeholder={t('lbl.skype_url')} />
          </Form.Item>
          <Form.Item name="web_url" label={t('lbl.web_url')}>
            <Input placeholder={t('lbl.web_url')} />
          </Form.Item>
          <Form.Item name="another_url" label={t('lbl.another_url')}>
            <Input placeholder={t('lbl.another_url')} />
          </Form.Item>
          <Form.Item>
            <div className="d-flex">
              <Button type="link" className="text-red pl-0 pr-0" onClick={onDelete}>
                {t('lbl.delete_account')}
              </Button>
              <Button type="primary" htmlType="submit" className="ml-auto" loading={loading}>
                {t('lbl.save')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};