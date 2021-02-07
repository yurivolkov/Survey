import React from 'react';
import { MoreOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Button, Modal, notification } from 'antd';
import { deleteData } from 'store/requests/global';

export default ({ t, id, onDelete, setEdit }) => {

  const onDeleteClick = () => {
    Modal.confirm({
      title: t('lbl.sure_delete_comment'),
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteData({ url: `comments/${id}` }).then(() => {
          notification.success({ message: t('msg.success_comment_delete') });
        }).catch(() => {
          notification.error({ message: t('msg.error_comment_delete') });
        });
        onDelete();
      }
    });
  };

  const onEditClick = () => {
    setEdit(true);
  };

  return (
    <Dropdown trigger={['click']} overlay={
      <Menu>
        <Menu.Item onClick={onDeleteClick}>
          <DeleteOutlined className="mr-5" />
          {t('lbl.delete')}
        </Menu.Item>
        <Menu.Item onClick={onEditClick}>
          <EditOutlined className="mr-5" />
          {t('lbl.edit')}
        </Menu.Item>
      </Menu>
    }>
      <Button type="link" icon={<MoreOutlined />} className="CommentMenuButton" />
    </Dropdown>
  )
};