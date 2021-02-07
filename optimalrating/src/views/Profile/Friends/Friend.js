import React from 'react';
import { UserAvatar, UserLink, AddRemoveFriend } from 'components';

export default ({ data }) => {
  return (
    <div className="Friend">
      <UserAvatar src={data.user_details.profile_image} className="mr-10" />
      <UserLink data={data} popover={false} />
      <AddRemoveFriend id={data.id} />
    </div>
  );
};