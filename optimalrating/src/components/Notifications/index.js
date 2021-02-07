import React from 'react';
import { Button, Badge, Popover, notification } from 'antd';
import { BellOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Empty, UserAvatar, UserLink } from 'components';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { patchData } from 'store/requests/global';
import { updateState } from 'store/requests/auth';

export default () => {
  const { t } = useTranslation();
  const requests = useSelector(state => state.auth.account.pending_friends);

  const onRespond = (answer, request, index) => {
    patchData({ url: `friend/requestAnswer/${request.user.id}`, data: { answer } }).then(() => {
      requests.splice(index, 1);
      updateState({ key: 'account.pending_friends', data: requests });
      notification.success({ message: t(`msg.friend_request_${answer}`) });
    }).catch(() => {
      notification.error({ message: t('msg.error_answer') });
    });
  };

  return (
    <Popover trigger="click" overlayClassName="NotificationPopover" content={
      <Empty isEmpty={requests.length === 0} text={t('lbl.no_requests')}>
        {requests.map((x, i) => (
          <div key={x.id} className="d-flex a-center">
            <UserAvatar src={x.user.user_details.profile_image} className="mr-10" />
            <UserLink data={x.user} popover={false} />
            <div className="ml-auto">
              <Button size="small" type="link" icon={<CheckCircleOutlined />} className="pl-0 pr-0" onClick={() => onRespond('yes', x, i)} />
              <Button size="small" type="link" icon={<CloseCircleOutlined />} className="pl-0 pr-0" onClick={() => onRespond('no', x, i)} />
            </div>
          </div>
        ))}
      </Empty>
    }>
      <Badge count={requests.length} offset={[-5, 5]} className="NotificationBadge">
        <Button type="link" icon={<BellOutlined />} />
      </Badge>
    </Popover>
  );
};