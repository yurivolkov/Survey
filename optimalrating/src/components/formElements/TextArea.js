import React from 'react';
import { Input } from 'antd';

export default React.forwardRef((props, ref) => {

  const onChange = (e) => {
    if (!props.maxLength || (e.target.value.length <= props.maxLength)) {
      props.onChange(e);
    }
  };

  return (
    <div className="TextArea">
      <Input.TextArea value={props.value} onChange={onChange} placeholder={props.placeholder} />
      {props.maxLength &&
        <div className="TextAreaLength">
          {props.value ? props.value.length : 0}
          /
          {props.maxLength}
        </div>
      }
    </div>
  );
});