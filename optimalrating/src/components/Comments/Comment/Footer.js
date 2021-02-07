import React from 'react';
import moment from 'moment';
import { Button, Divider, notification } from 'antd';
import { MessageOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import CommentMenu from './CommentMenu';
import { useSelector } from 'react-redux';
import { postData } from 'store/requests/global';
import { Permission } from 'components';

export default ({ data, isSub, answerVisible, setAnswerVisible, commentVisible, setCommentVisible, setEdit, onEdit, onDelete, t }) => {
  const account = useSelector(state => state.auth.account);
  const likeIndex = account ? data.likes.findIndex(x => x.user_id === account.id.toString()) : undefined;
  const isOwn = account ? data.user_id === account.id.toString() : false;

  const getTime = () => {
    let difference = new Date().getTimezoneOffset() / -60;
    let date = moment(data.updated_at).add(difference, "hours");
    return date.fromNow();
  };

  const onLike = () => {
    let comment = { ...data };
    if (likeIndex > -1) comment.likes.splice(likeIndex, 1);
    else comment.likes.push({ user_id: account.id.toString() });
    onEdit(comment);
    postData({ url: 'likes', data: { comment_id: data.id } }).then(() => {
      notification.success({ message: t('msg.success_comment_like') });
    }).catch(() => {
      notification.error({ message: t('msg.error_comment_like') });
    });
  };

  return (
    <div className="CommentFooter">
      {getTime()}
      <Divider type="vertical" />
      <Permission showChild>
        <Button size="small" type="link" icon={likeIndex > -1 ? <LikeFilled /> : <LikeOutlined />} onClick={onLike}>
          {t('lbl.like')}
          {data.likes.length > 0 &&
            ` (${data.likes.length})`
          }
        </Button>
      </Permission>
      {!isSub &&
        <>
          <Divider type="vertical" />
          <Permission showChild>
            <Button size="small" type="link" icon={<MessageOutlined />} onClick={() => setAnswerVisible(!answerVisible)}>
              {t('lbl.answer')}
            </Button>
          </Permission>
          {data.comments.length > 0 &&
            <>
              <Divider type="vertical" />
              <Button size="small" type="link" icon={<MessageOutlined />} onClick={() => setCommentVisible(!commentVisible)}>
                {t(`lbl.${commentVisible ? 'hide' : 'show'}_comments`)} ({data.comments.length})
            </Button>
            </>
          }
        </>
      }
      {isOwn &&
        <CommentMenu t={t} onDelete={onDelete} setEdit={setEdit} id={data.id} />
      }
    </div>
  );
};