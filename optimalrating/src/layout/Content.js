import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Card, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import routes from 'plugins/routes';
import eventBus from 'plugins/eventBus';
import { TopList } from 'components';
import { useSelector } from 'react-redux';

export default ({ t, i18n }) => {
  const user = useSelector(state => state.auth.account);

  const onClick = () => {
    eventBus.$emit('changeLanguage', 'null');
  };

  return (
    <div className="Content">
      <div className="Container">
        <Switch>
          {routes.map(x =>
            <Route
              exact={x.exact}
              key={x.path}
              path={`${x.path}`}
              render={props => (
                user && user.status === 'freeze' && !x.freeze ?
                  <Redirect to="/approve" />
                  :
                  user && user.status !== 'freeze' && x.freeze ?
                    <Redirect to="/" />
                    :
                    !x.private || (x.private && user) ?
                      <x.component {...props} route={x} />
                      :
                      <Redirect to="/" />
              )}
            />
          )}
        </Switch>
      </div>
      <div className="Right">
        <Card bordered={false}>
          <Button type="link" icon={<GlobalOutlined />} onClick={onClick}>
            {t('lbl.world')}
          </Button>
        </Card>
        <Card bordered={false}>
          <TopList />
        </Card>
      </div>
    </div>
  );
};