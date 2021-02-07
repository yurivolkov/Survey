import React from 'react';
import { useGet } from 'hooks';
import { Link } from 'react-router-dom';
import { Divider, Spin } from 'antd';
import { get } from 'helpers';

export default ({ t }) => {
  const { data, loading } = useGet({ url: 'pages', key: 'pages' });

  return (
    <div className="Copyright">
      <Spin spinning={loading}>
        {get(data, 'result.set', []).map((x, i) => (
          <span key={x.id}>
            <Link to={`/pages/${x.slug}`}>
              {x.translation ? x.translation.title : x.title}
            </Link>
            {i !== data.result.set.length - 1 &&
              <Divider type="vertical" />
            }
          </span>
        ))}
      </Spin>
    </div>
  );
};