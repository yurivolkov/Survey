import React from 'react';
import { Radio, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowDownOutlined } from '@ant-design/icons';
import { Empty } from 'components';
import { useTranslation } from 'react-i18next';

export default ({ className = '', data, surveyId, onClick, isSpecial, selected }) => {
  const { t } = useTranslation();

  return (
    <div className={`LineChart ${className}`}>
      <Empty isEmpty={!data.length} description={t('lbl.no_answer')}>
        {data.map(x => (
          <div key={x.id} className="Line" onClick={() => onClick(x)}>
            <div className="Label">
              {isSpecial && <Radio checked={JSON.stringify(selected) === JSON.stringify(x)} />}
              {x.choice_title}
            </div>
            <div className="Bar">
              <div className="BarBg" style={{ width: `${x.percent}%` }} />
              <span>{x.percent} %</span>
            </div>
          </div>
        ))}
      </Empty>
      {!isSpecial && data.length > 0 &&
        <>
          <Divider style={{ marginTop: 12, marginBottom: 12 }} />
          <div className="text-center">
            <Link to={`/survey/${surveyId}/details`} className="text-sm">
              <ArrowDownOutlined className="mr-5" />
              {t('lbl.show_more')}
            </Link>
          </div>
        </>
      }
    </div>
  );
};