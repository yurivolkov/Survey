import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { Button, Divider } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import Answer from './Answer';
import { useTranslation } from 'react-i18next';
import { Permission } from 'components';

export default ({ data, surveyId }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [visible, setVisible] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const icon = visible ? <UpOutlined /> : <DownOutlined />;
  const length = visible ? data.length : 2;

  const onAdd = (item) => {
    comments.unshift(item);
    setComments([...comments]);
  };

  const onEdit = (item, index) => {
    comments[index] = item;
    setComments([...comments]);
  };

  const onDelete = (index) => {
    comments.splice(index, 1);
    setComments([...comments]);
  };

  useEffect(() => {
    if (data) setComments(data);
  }, [data]);

  return (
    <div className="Comments">
      <h3 className="text-bold">
        {data.length} {t('lbl.comments')}
        <Divider type="vertical" />
        <Permission showChild>
          <Button type="link" className="pl-0 pr-0" onClick={() => setAnswerVisible(!answerVisible)}>
            {t('lbl.write_comment')}
          </Button>
        </Permission>
      </h3>
      {answerVisible &&
        <Answer {...{ t, setAnswerVisible, surveyId, onAdd }} />
      }
      {comments && comments.slice(0, length).map((x, index) => (
        <Comment {...{ key: x.id, index, t, surveyId, onEdit, onDelete, data: x }} />
      ))}
      {comments.length > 2 &&
        <div className="text-center">
          <Button size="small" type="link" className="text-sm" icon={icon} onClick={() => setVisible(!visible)}>
            {t(`lbl.${visible ? 'hide' : 'show'}_comments`)}
          </Button>
        </div>
      }
    </div>
  );
};