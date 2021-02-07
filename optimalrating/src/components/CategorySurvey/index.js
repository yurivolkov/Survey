import React, { useState } from 'react';
import { Card, Divider, Spin, Button } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import PieChart from './PieChart';
import CategoryModal from './CategoryModal';
import { calculateSurvey, get, exists } from 'helpers';
import { Comments, LineChart, Permission, Empty, NewSurveyChoice, Share } from 'components';
import { useGet } from 'hooks';

export default ({ url, survey, hasData = false, onRefresh, short = false }) => {
  const { data, loading, refresh } = hasData ? { data: survey, loading: false, refresh: onRefresh } : useGet({ url });
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation();
  const history = useHistory();
  const choices = calculateSurvey(get(data, 'result.set.choices', []));

  const Extra = () => (
    <Permission showChild type="agreement" callback={() => history.push('/survey')}>
      <Button type="link" icon={<PlusOutlined />}>
        {t('lbl.add_new_survey')}
      </Button>
    </Permission>
  );

  const Title = () => (
    <Link to={`/survey/${get(data, 'result.set.id')}`}>
      {get(data, 'result.set.title')}
    </Link>
  );

  const onClick = (item) => {
    setSelected(item);
  };

  return (
    <div className="CategorySurvey">
      <Spin spinning={loading || false}>
        <Card title={<Title />} extra={<Extra />} bordered={false}>
          <Empty isEmpty={!exists(data, 'result.set')}>
            <div>
              {!short &&
                <>
                  <PieChart data={choices} />
                  <Divider style={{ marginBottom: 10 }} />
                  <div className="d-flex">
                    <NewSurveyChoice />
                    <Share className="ml-auto" title={get(data, 'result.set.title')} url={window.location.href} />
                  </div>
                  <Divider style={{ marginTop: 10 }} />
                </>
              }
              <LineChart className="mb-20" data={choices} surveyId={get(data, 'result.set.id')} onClick={onClick} />
              {!short &&
                <Comments data={get(data, 'result.set.comments', [])} surveyId={get(data, 'result.set.id')} />
              }
              {selected && !short &&
                <CategoryModal t={t} data={selected} surveyId={get(data, 'result.set.id')} onClick={onClick} onRefresh={refresh} />
              }
            </div>
          </Empty>
        </Card>
      </Spin>
    </div>
  );
};