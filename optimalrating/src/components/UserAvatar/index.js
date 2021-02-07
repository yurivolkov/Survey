import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default ({ src, className = '', size = 32, shape = "circle" }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const onError = () => {
    setError(true);
  };

  const renderSrc = !error && src ? `${process.env.REACT_APP_CDN_URL}images/user/${src}` : null;
  const renderIcon = (error || !src) ? <UserOutlined /> : null;

  return (
    <Avatar shape={shape} size={size} className={`UserAvatar ${className}`}
      onError={onError} src={renderSrc} icon={renderIcon} />
  );
};