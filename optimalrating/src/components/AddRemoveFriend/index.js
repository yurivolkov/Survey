import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, notification, Spin } from 'antd';
import { UserDeleteOutlined, UserAddOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getData, patchData, postData, deleteData } from 'store/requests/global';
import { updateState } from 'store/requests/auth';
import { useFriend } from 'hooks';

export default ({ id }) => {
  const { t } = useTranslation();
  const user = useSelector(state => state.auth.account);
  const [loading, setLoading] = useState(false);
  const [type, friend, list, index] = useFriend(id);

  const updateList = (key, item, isAdd) => {
    let data = isAdd ? [...user.friends] : [...list];
    item ? data.push(item) : data.splice(index, 1);
    updateState({ key, data });
    setLoading(false);
  };

  const onAdd = () => {
    setLoading(true);
    getData({ url: `friend/requestFriend/${id}` }).then(() => {
      notification.success({ message: t('msg.success_friend_request') });
      updateList('account.pending_request_friends', { friend: id.toString() });
    }).catch(() => {
      notification.error({ message: t('msg.error_friend_request') });
      setLoading(false);
    });
  };

  const onRemove = () => {
    setLoading(true);
    postData({ url: `friend/deleteFriend`, data: { friends: [friend.friend.id] } }).then(() => {
      notification.success({ message: t('msg.success_friend_remove') });
      updateList('account.friends');
    }).catch(() => {
      notification.error({ message: t('msg.error_friend_remove') });
      setLoading(false);
    });
  };

  const onRespond = (answer) => {
    setLoading(true);
    patchData({ url: `friend/requestAnswer/${id}`, data: { answer } }).then(() => {
      notification.success({ message: t(`msg.friend_request_${answer}`) });
      answer === 'yes' && updateList('account.friends', { friend: friend.user });
      updateList('account.pending_friends');
    }).catch(() => {
      notification.error({ message: t('msg.error_friend_respond') });
      setLoading(false);
    });
  };

  const onCancel = () => {
    setLoading(true);
    deleteData({ url: `friend/requestFriend/${id}` }).then(() => {
      notification.success({ message: t('msg.success_friend_request_cancel') });
      updateList('account.pending_request_friends');
    }).catch(() => {
      notification.error({ message: t('msg.error_friend_request_cancel') });
      setLoading(false);
    });
  };

  const buttons = {
    friend: () => (
      <Button block type="link" className="text-red" icon={<UserDeleteOutlined />} onClick={onRemove} loading={loading}>
        {t('lbl.remove_friend')}
      </Button>
    ),
    pending: () => (
      <Button block type="link" className="text-red" icon={<CloseOutlined />} onClick={onCancel} loading={loading}>
        {t('lbl.cancel_request')}
      </Button>
    ),
    answer: () => (
      <Spin spinning={loading}>
        <div className="text-center">
          <Button size="small" type="link" onClick={() => onRespond('yes')}>
            {t('lbl.accept')}
          </Button>
          <Button size="small" type="link" onClick={() => onRespond('no')} className="text-red">
            {t('lbl.refuse')}
          </Button>
        </div>
      </Spin>
    ),
    default: () => (
      <Button block type="link" icon={<UserAddOutlined />} onClick={onAdd} loading={loading}>
        {t('lbl.add_friend')}
      </Button>
    )
  };

  return (
    user && id && type !== 'self' && buttons[type]()
  );
};