import React from 'react';
import { CategorySurvey } from 'components';

export default ({ data, onRefresh }) => {
  return (
    <div className="Survey">
      <CategorySurvey survey={data} onRefresh={onRefresh} hasData />
    </div>
  );
};