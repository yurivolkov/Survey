import React from 'react';
import { Empty } from 'antd';

export default ({ className = '', children, isEmpty = true, text = '', description, emptyChild }) => {
  return (
    isEmpty ?
      text ?
        <div className={`text-grey text-center ${className}`}>
          {text}
        </div>
        :
        <Empty className={className} description={description}>
          {emptyChild}
        </Empty>
      :
      children ?
        children
        :
        null
  );
};