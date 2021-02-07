import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Popover } from 'antd';
import { UserAvatar, AddRemoveFriend } from 'components';
import { useSelector } from 'react-redux';

export default ({ data, popover = true }) => {
  const [visible, setVisible] = useState(false);
  const user = useSelector(state => state.auth.account);
  const isSelf = user && user.id === data.id;

  const onVisibleChange = (e) => {
    setVisible(e);
  };

  return (
    <Popover visible={popover && user && !isSelf ? visible : false} onVisibleChange={onVisibleChange} placement="top" overlayClassName="UserPopover" content={
      <div>
        <div className="d-flex a-center">
          <UserAvatar src={data.user_details.profile_image} className="mr-10" shape="square" size={48} />
          <div>
            <div className="text-bold">{data.firstname} {data.lastname}</div>
          </div>
        </div>
        <div className="pt-10">
          <AddRemoveFriend id={data.id} />
        </div>
      </div>
    }>
      <Link to={`/user/${data.username}`} className="UserLink">
        {data.firstname} {data.lastname}
      </Link>
    </Popover>
  );
};