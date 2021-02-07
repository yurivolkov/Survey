import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, notification } from 'antd';
import { postData, putData } from 'store/requests/global';

export default ({ t, setAnswerVisible, surveyId, commentId, onAdd, editItem }) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.auth.account);
  const [body, setBody] = useState(editItem ? editItem.body : '');

  const onSubmit = () => {
    if (body) {
      setLoading(true);
      const data = commentId ? { comment_id: commentId, body } : { survey_id: surveyId, body };
      if (editItem) {
        putData({ url: `comments/${commentId}`, data: { body } }).then(() => {
          notification.success({ message: t('msg.success_comment_save') });
          setLoading(false);
          onAdd({ ...editItem, body });
          setAnswerVisible(false);
        }).catch(() => {
          notification.error({ message: t('msg.error_comment_save') });
          setLoading(false);
        });
      } else {
        postData({ url: 'comments', data }).then(response => {
          notification.success({ message: t('msg.success_comment_save') });
          setLoading(false);
          onAdd({ ...response.result.set, likes: [], comments: [], user });
          setAnswerVisible(false);
        }).catch(() => {
          notification.error({ message: t('msg.error_comment_save') });
          setLoading(false);
        });
      }
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Input.TextArea value={body} onChange={(e) => setBody(e.target.value)}
        placeholder={t('lbl.write_comment_placeholder')} />
      <div className="mt-10">
        <Button type="primary" size="small" className="text-sm" onClick={onSubmit} loading={loading}>
          {t('lbl.okay')}
        </Button>
        <Button type="link" size="small" className="text-sm" onClick={() => setAnswerVisible(false)}>
          {t('lbl.cancel')}
        </Button>
      </div>
    </div>
  );
};