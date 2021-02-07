import React from 'react';
import { useSelector } from 'react-redux';
import { Spin, Divider, Card, Collapse, Button } from 'antd';
import { Empty, CategorySurvey, Permission } from 'components';
import { get, exists } from 'helpers';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DoubleRightOutlined, PlusOutlined } from '@ant-design/icons';

export default ({ match, history }) => {
  const { t } = useTranslation();
  const { data, loading } = useSelector(state => state.global.tree);
  const { id } = match.params;

  const findItem = () => {
    const list = [];
    get(data, 'result.set', []).forEach(x => {
      list.push({ ...x, name: t(x.code) }, ...x.children.map(y => ({ ...y, parentName: t(x.code) })));
    });
    return list.find(x => x.id === parseInt(id));
  };

  const item = findItem();

  return (
    <div className="Category">
      <Spin spinning={loading}>
        <Empty isEmpty={!item}>
          <h1 className="text-bold text-xxl">
            {exists(item, 'parentName') &&
              <>
                <Link to={`/category/${get(item, 'parent')}`}>
                  {get(item, 'parentName')}
                </Link>
                <DoubleRightOutlined className="ml-5 mr-5 text-md" />
              </>
            }
            {get(item, 'name')}
          </h1>
          {exists(item, 'surveys') ?
            <Empty isEmpty={get(item, 'surveys', []).length === 0} description={t('lbl.no_survey')} emptyChild={
              <Permission showChild type="agreement" callback={() => history.push('/survey')}>
                <Button type="primary" icon={<PlusOutlined />}>
                  {t('lbl.add_new_survey')}
                </Button>
              </Permission>
            }>
              {get(item, 'surveys', []).map(x => (
                <>
                  <CategorySurvey key={x.id} url={`surveys/detail/${x.id}`} short />
                  <Divider style={{ borderColor: 'rgba(0,0,0,0.1)' }} />
                </>
              ))}
            </Empty>
            :
            <Empty isEmpty={get(item, 'children', []).length === 0}>
              <Card>
                <Collapse>
                  {get(item, 'children', []).map(x => (
                    <Collapse.Panel key={x.id} header={
                      <Link to={`/category/${x.id}`}>
                        {x.name}
                      </Link>}>
                      <Empty isEmpty={!x.surveys || x.surveys.length === 0} description={t('lbl.no_survey')}>
                        {x.surveys && x.surveys.length > 0 && x.surveys.slice(0, 2).map(y => (
                          <div key={y.id}>
                            <Link to={`surveys/detail/${y.id}`}>
                              {y.title}
                            </Link>
                          </div>
                        ))}
                      </Empty>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </Card>
            </Empty>
          }
        </Empty>
      </Spin>
    </div>
  );
};