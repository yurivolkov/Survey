import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Card as AntCard } from 'antd';

export const Card = ({ loading, children }) => (
  <>
    {loading ?
      <AntCard bordered={false}>
        <div className="Loading Large pt-50 pb-50">
          <LoadingOutlined />
        </div>
      </AntCard>
      :
      children
    }
  </>
);

export default ({ className = '' }) => (
  <div className={`Loading ${className}`}>
    <LoadingOutlined />
  </div>
);
