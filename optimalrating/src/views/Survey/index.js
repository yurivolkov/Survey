import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import { useGet } from 'hooks';

export default ({ match, route }) => {
  const { id } = match.params;
  const { data, loading, refresh } = useGet({ url: `/surveys/detail/${id}` });

  return (
    <div className="Survey">
      <Spin spinning={loading}>
        <Switch>
          {route.routes.map(x => (
            <Route
              exact
              key={x.path}
              path={x.path}
              render={(props) => <x.component {...props} data={data} onRefresh={refresh} />}
            />
          ))}
        </Switch>
      </Spin>
    </div>
  )
};