import React from 'react';
import { Divider } from 'antd';
import { SpecialSurvey, CategorySurvey } from 'components';

export default () => {

  return (
    <div className="Home">
      <SpecialSurvey />
      <Divider style={{ borderColor: 'rgba(0,0,0,0.1)' }} />
      <CategorySurvey url={`/home-survey-approval`} />
    </div>
  );
};