import React from 'react';
import { SurveyDetail } from 'components';
import { get } from 'helpers';

export default ({ data }) => {

  return (
    <div className="Survey">
      <SurveyDetail data={get(data, 'result.set')} />
    </div>
  )
};