import React from 'react';
import { Spin } from 'antd';
import { useGet } from 'hooks';
import { Empty } from 'components';
import { get } from 'helpers';

export default ({ match }) => {
  const { id } = match.params;
  const { data, loading } = useGet({ url: `subjectHasSurvey/${id}` });

  return (
    <Spin spinning={loading}>
      <h2>{get(data, 'result.set.title')}</h2>
      <Empty isEmpty={get(data, 'result.set.surveys', []).length === 0}>
        Subject
      </Empty>
    </Spin>
  );
};