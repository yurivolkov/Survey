import React from 'react';
import { useGet } from 'hooks';
import { Spin, Select, notification } from 'antd';
import { exists } from 'helpers';
import { privacyOrder } from 'helpers/constants';
import { Empty } from 'components';
import { postData } from 'store/requests/global';

export default ({ t }) => {
  const { data, loading } = useGet({ url: 'userPrivacySettings' });
  const privacyData = exists(data, 'result.set') ? privacyOrder.map(i => data.result.set[i]) : [];

  const onChange = (option, privacy) => {
    postData({ url: 'userPrivacySettings', data: { option, privacy } }).then(() => {
      notification.success({ message: t('msg.updated') });
    });
  };

  const getValue = (value, options) => {
    let item = options.find(x => x.id.toString() === value.id.toString());
    if (!item) item = options.find(x => x.option === value.option);
    return item.id.toString();
  };

  return (
    <Spin spinning={loading}>
      <div className="ProfilePrivacy">
        <h3 className="text-bold text-grey">{t('lbl.who_can_see')}</h3>
        <Empty isEmpty={!exists(data, 'result.set')}>
          <div className="content content-xs ml-0">
            <table>
              <tbody>
                {privacyData.map(x => (
                  <tr key={x.id}>
                    <td className="Label">{t(`lbl.${x.privacy.translate_key}`)}</td>
                    <td className="Value">
                      <Select className="full-width" defaultValue={getValue(x.option, x.privacy.options)} onChange={(e) => onChange(e, x.id.toString())}>
                        {x.privacy.options.map(y => (
                          <Select.Option key={y.id.toString()}>
                            {t(`lbl.${y.option.toLowerCase()}`)}
                          </Select.Option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Empty>
      </div>
    </Spin>
  );
};