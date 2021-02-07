import React from 'react';
import { Card, Spin } from 'antd';
import { Empty } from 'components';
import { get } from 'helpers';
import { useSelector } from 'react-redux';

export default ({ match }) => {
  const { data, loading } = useSelector(state => state.global.pages);
  const page = get(data, 'result.set', []).find(x => x.slug === match.params.slug);

  return (
    <div className="Pages">
      <Spin spinning={loading}>
        <Card title={page ? page.translation ? page.translation.title : page.title : null} bordered={false}>
          <Empty isEmpty={!page}>
            <div dangerouslySetInnerHTML={{ __html: page ? page.translation ? page.translation.body : page.body : null }} />
          </Empty>
        </Card>
      </Spin>
    </div>
  );
};