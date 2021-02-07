import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { CameraOutlined } from '@ant-design/icons';

export default ({ src, className = '', size = 80, shape = "square" }) => {
  const [error, setError] = useState(false);
  const [url, setUrl] = useState('images/choice/');

  useEffect(() => {
    setError(false);
  }, [src]);

  const onError = () => {
    if (url === 'images/choice/') {
      setUrl('images/survey_approval/');
    } else {
      setError(true);
    }
  };

  const renderSrc = !error && src ? `${process.env.REACT_APP_CDN_URL}${url}${src}` : null;
  const renderIcon = (error || !src) ? <CameraOutlined /> : null;

  return (
    <Avatar shape={shape} size={size} className={`SurveyAvatar ${className}`}
      onError={onError} src={renderSrc} icon={renderIcon} />
  );
};