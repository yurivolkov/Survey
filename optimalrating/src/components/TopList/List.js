import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Empty } from 'components';
import { Button } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

export default ({ t, data, url = '', value = '', text = '', translate }) => {
  const [visible, setVisible] = useState(false);
  const length = visible ? data.length : 4;

  return (
    <Empty isEmpty={!data.length} text={t(text)}>
      {data.slice(0, length).map(x => (
        <div key={x.id}>
          <Link to={`/${url}/${x[value]}`}>
            {translate ? t(x.translate_key) : x.title}
          </Link>
        </div>
      ))}
      {data.length > 4 &&
        <div>
          <Button type="link" icon={visible ? <ArrowUpOutlined /> : <ArrowDownOutlined />} onClick={() => setVisible(!visible)}>
            {t(`lbl.show_${visible ? 'less' : 'more'}`)}
          </Button>
        </div>
      }
    </Empty>
  )
};