import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Card, Button, Divider, Spin, Modal, notification } from 'antd';
import { LineChart, Comments, Empty, Permission } from 'components';
import { calculateSurvey, get } from 'helpers';
import { useGet } from 'hooks';
import { getData, postData } from 'store/requests/global';

export default () => {
  const { data, loading, refresh } = useGet({ url: 'home-special-survey', key: 'specialSurvey' });
  const [voting, setVoting] = useState(false);
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation();
  const choices = calculateSurvey(get(data, 'result.set.choices', []), true);
  const history = useHistory();

  const onClick = (item) => {
    setSelected(item);
  };

  const submitVote = () => {
    postData({ url: `submitVote/${get(data, 'result.set.id')}`, data: { choice_id: selected.id } }).then(response => {
      notification.success({ message: t('msg.success_mark') });
      setVoting(false);
      setSelected(false);
      refresh();
    }).catch((err) => {
      console.log(err);
      if (err.message === 'msg.info.not_approved') {
        // not approved user
        Modal.confirm({
          title: '',
          content: t('msg.must_approved'),
          onOk: () => history.push('profile')
        });
      } else notification.error({ message: t('msg.error_mark') });
      setVoting(false);
    });
  };

  const cancelVote = (idList) => {
    setVoting(true);
    Promise.all(idList.map(x => getData({ url: `cancelVote/${get(data, 'result.set.id')}/${x}` }))).then(() => {
      submitVote();
    }).catch(() => {
      setVoting(false);
    });
  };

  const onVote = () => {
    setVoting(true);
    const promises = choices.map(x => getData({ url: `checkVote/${get(data, 'result.set.id')}/${x.id}` }).then(response => {
      return response;
    }).catch(() => {
      return null;
    }));
    Promise.all(promises).then(responses => {
      const response = responses.filter(x => x);
      console.log(responses, response);
      if (response.length > 0) {
        setVoting(false);
        Modal.confirm({
          title: t('lbl.cancel_vote'),
          content: t('lbl.survey_already_voted'),
          onOk: () => cancelVote(response.map(x => x.result.set.choice_id))
        });
      } else {
        submitVote();
      }
    });
  };

  return (
    <Spin spinning={loading}>
      <Card title={get(data, 'result.set.title')} bordered={false}>
        <Empty isEmpty={!get(data, 'result.set')}>
          <div>
            <LineChart data={choices} selected={selected} onClick={onClick} isSpecial />
            <div className="mt-20 pl-10">
              <Permission showChild>
                <Button type="primary" disabled={!selected} onClick={onVote} loading={voting}>
                  {t('lbl.vote')}
                </Button>
              </Permission>
              <Divider />
              <Comments data={get(data, 'result.set.comments', [])} surveyId={get(data, 'result.set.id')} />
            </div>
          </div>
        </Empty>
      </Card>
    </Spin>
  );
};