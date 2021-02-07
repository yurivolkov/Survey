import React, { useState } from 'react';
import { UserAvatar, UserLink } from 'components';
import Footer from './Footer';
import Answer from 'components/Comments/Answer';

const Comment = ({ data, index, t, isSub, surveyId, onEdit, onDelete }) => {
  const [answerVisible, setAnswerVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const [edit, setEdit] = useState(false);

  const onAdded = (item) => {
    data.comments.unshift(item);
    onEdit(data, index);
  };

  const onEdited = (item, i) => {
    if (i) {
      data.comments[i] = item;
      onEdit(data, index);
    } else {
      onEdit(item, index);
    }
  }

  const onDeleted = (i) => {
    if (i) {
      data.comments.splice(i, 1);
      onEdit(data, index);
    } else {
      onDelete(index);
    }
  };

  return (
    <div className="Comment">
      <UserAvatar src={data.user.user_details.profile_image} />
      <div className="CommentContent">
        <UserLink data={data.user} />
        <div className="CommentText">
          {edit ?
            <Answer {...{ t, setAnswerVisible: setEdit, commentId: data.id, onAdd: onEdited, editItem: data }} />
            :
            data.body
          }
        </div>
        <Footer {...{ data, isSub, answerVisible, setAnswerVisible, commentVisible, setCommentVisible, setEdit, t, onEdit: onEdited, onDelete: onDeleted }} />
        {(answerVisible || commentVisible) &&
          <div className="Comments mt-10">
            {answerVisible &&
              <Answer {...{ t, setAnswerVisible, surveyId, commentId: data.id, onAdd: onAdded }} />
            }
            {commentVisible && data.comments.map((x, i) => (
              <Comment {...{ key: x.id, t, data: x, index: i, onEdit: onEdited, onDelete: onDeleted }} isSub />
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default Comment;