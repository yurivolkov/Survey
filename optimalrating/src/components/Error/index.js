import React from 'react';
import { Result, Button } from 'antd';

export default ({ onClick }) => {

  return (
    <Result status="warning" className="AppError" title="Application could not be loaded." subTitle={
      <div className="text-center">
        <Button type="primary" onClick={onClick}>
          Refresh
        </Button>
      </div>
    } />
  );
};