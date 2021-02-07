import React, { useState } from 'react';
import { TreeSelect } from 'antd';
import { useSelector } from 'react-redux';
import { get } from 'helpers';
import { useTranslation } from 'react-i18next';

export default React.forwardRef((props, ref) => {
  const [value, setValue] = useState(undefined);
  const { t } = useTranslation();
  const { data, loading } = useSelector(state => state.global.tree);

  const onChange = (e) => {
    setValue(e);
    props.onChange && props.onChange(e);
  };

  return (
    <TreeSelect loading={loading} value={value} onChange={onChange}>
      {get(data, 'result.set', []).map(x => (
        <TreeSelect.TreeNode key={x.id} value={x.id} title={t(x.code)} selectable={false}>
          {x.children.map(y => (
            <TreeSelect.TreeNode key={y.id} value={y.id} title={y.name} />
          ))}
        </TreeSelect.TreeNode>
      ))}
    </TreeSelect>
  );
});