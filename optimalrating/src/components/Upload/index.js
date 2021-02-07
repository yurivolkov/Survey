import React, { useState } from 'react';
import { Upload } from 'antd';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';
import { postData } from 'store/requests/global';
import { urls } from 'helpers/constants';

export default React.forwardRef(({ value, onChange, type = 'sa' }, ref) => {
  const [src, setSrc] = useState(value || '');
  const [loading, setLoading] = useState(false);
  const options = {
    className: 'SurveyUpload',
    listType: 'picture-card',
    accept: 'jpeg, .jpg, .jpe, .png, image/x-png, image/gif, image/jpeg',
    showUploadList: false,
    action: `${process.env.REACT_APP_API_URL}file/upload`,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const beforeUpload = (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    form.append('width', 240);
    form.append('height', 240);
    setLoading(true);
    postData({ url: 'file/upload', data: form }).then(response => {
      setSrc(response.result.set[0].name);
      onChange && onChange(response.result.set[0].name);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  return (
    <Upload cl {...options} beforeUpload={beforeUpload}>
      {src ?
        <img src={`${process.env.REACT_APP_CDN_URL}images/${urls[type]}/${src}`} alt="" />
        :
        loading ?
          <LoadingOutlined />
          :
          <CameraOutlined />
      }
    </Upload>
  );
});