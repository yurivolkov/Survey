import React, { useState } from 'react';
import { Card, Divider, Dropdown, Button, Menu } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { calculateSurvey, get } from 'helpers';
import { SurveyAvatar, Comments } from 'components';
import { orderBy } from 'lodash';

export default ({ data }) => {
  const { t } = useTranslation();
  const choices = calculateSurvey(get(data, 'choices', []));
  const [sort, setSort] = useState('percent');
  const sorts = {
    percent: 'percent',
    choice_title: (x) => x.choice_title.toLowerCase()
  };

  const Extra = () => (
    <Dropdown overlay={
      <Menu onClick={({ key }) => setSort(key)}>
        <Menu.Item key="percent">{t('lbl.sort_score')}</Menu.Item>
        <Menu.Item key="choice_title">{t('lbl.sort_alphabetic')}</Menu.Item>
      </Menu>
    }>
      <Button type="link" icon={<SortAscendingOutlined />} />
    </Dropdown>
  );

  return (
    <Card className="SurveyDetail" title={get(data, 'title')} extra={<Extra />} bordered={false}>
      <div className="SurveyItems">
        {orderBy(choices, sorts[sort], sort === 'percent' ? 'desc' : 'asc').map(x => (
          <div key={x.id} className="SurveyItem">
            <SurveyAvatar src={x.choice_image} />
            <div className="SurveyContent">
              <div className="Label">
                {x.choice_title}
              </div>
              <div className="Description">
                {x.choice_description}
              </div>
              <div className="Bar">
                <div className="BarBg" style={{ width: `${x.percent}%` }} />
                <span>{x.percent}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Divider />
      <Comments data={get(data, 'comments', [])} />
    </Card>
  );
};