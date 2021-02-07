import React, { useState } from 'react';
import { Modal, Button, Rate, notification } from 'antd';
import { SurveyAvatar } from 'components';
import { getData, postData } from 'store/requests/global';

export default ({ onClick, onRefresh, surveyId, data, t }) => {
  const [mark, setMark] = useState(0);
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    setMark(0);
    onClick();
  };

  const submitVote = () => {
    postData({ url: `submitVote/${surveyId}`, data: { choice_id: data.id, mark } }).then(() => {
      notification.success({ message: t('msg.success_marking') });
      setLoading(false);
      onRefresh();
      onClick();
    }).catch(() => {
      notification.error({ message: t('msg.error_marking') });
      setLoading(false);
    });
  };

  const cancelVote = () => {
    setLoading(true);
    getData({ url: `cancelVote/${surveyId}/${data.id}` }).then(() => {
      submitVote();
    }).catch(() => {
      setLoading(false);
    });
  };

  const onMark = () => {
    setLoading(true);
    getData({ url: `checkVote/${surveyId}/${data.id}` }).then(() => {
      setLoading(false);
      Modal.confirm({
        title: t('lbl.cancel_vote'),
        content: t('lbl.choice_already_voted'),
        onOk: cancelVote
      });
    }).catch(() => {
      submitVote();
    });
  };

  const footer = [
    <div key="footer" className="d-flex">
      <Rate value={mark} onChange={(e) => setMark(e)} />
      <div className="ml-auto">
        <Button type="primary" disabled={!mark} loading={loading} onClick={onMark}>
          {t('lbl.okay')}
        </Button>
      </div>
    </div>
  ];

  return (
    <Modal width={600} visible={!!data} title={data.choice_title} footer={footer} wrapClassName="CategoryModal" onCancel={onCancel}>
      <div className="d-flex">
        <SurveyAvatar src={data.choice_image} />
        <div className="pt-10 ml-10">
          {data.choice_description}
        </div>
      </div>
    </Modal>
  )
};