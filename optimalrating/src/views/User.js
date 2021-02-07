import React from 'react';
import { Card, Spin, Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useGet } from 'hooks';
import { userFields } from 'helpers/constants';
import { get, exists } from 'helpers';
import { Empty, UserAvatar, AddRemoveFriend } from 'components';
import { useTranslation } from 'react-i18next';

export default ({ match }) => {
  const { id } = match.params;
  const { t } = useTranslation();
  const { data, loading } = useGet({ url: `user-profile/${id}` });

  return (
    <Spin spinning={loading}>
      <div className="User">
        <div className="UserCard">
          <Card bordered={false} className="text-center">
            <UserAvatar src={get(data, 'result.set.user_details.profile_image')} size={160} shape="square" />
            {get(data, 'result.set.status') === 'approved' &&
              <CheckCircleFilled />
            }
            <div className="text-lg text-bold mt-10">
              {get(data, 'result.set.firstname')} {get(data, 'result.set.lastname')}
            </div>
            <div className="mb-20">{get(data, 'result.set.city.name')}</div>
            <Button block type="primary">
              {t('lbl.about')}
            </Button>
            <AddRemoveFriend id={get(data, 'result.set.id')} />
          </Card>
        </div>
        <div className="UserDetails">
          <Card bordered={false}>
            <Empty isEmpty={!exists(data, 'result.set')}>
              <table>
                <tbody>
                  {userFields.map(x => (
                    <tr key={x.key}>
                      <td className="Label">{t(`lbl.${x.label || x.key}`)}</td>
                      <td className="Value">{
                        x.translate && get(data, `result.set.${x.key}`) ? t(`lbl.${get(data, `result.set.${x.key}`)}`) : get(data, `result.set.${x.key}`, '-')
                      }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Empty>
          </Card>
        </div>
      </div>
    </Spin>
  );
};