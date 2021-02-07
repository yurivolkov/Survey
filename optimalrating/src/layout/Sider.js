import React from 'react';
import { Link } from 'react-router-dom';
import { UnorderedListOutlined, RightOutlined } from '@ant-design/icons';
import { NewCategory, ScrollField, Empty } from 'components';
import { useGet } from 'hooks';
import { Menu, Divider, Spin, Button } from 'antd';
import { get } from 'helpers';

export default ({ account, t, isDrawer = false }) => {
  const { data, loading } = useGet({ url: 'categories/tree', key: 'tree', singleLoad: true });

  const Title = ({ text, id }) => (
    <>
      {text}
      <Link to={`/category/${id}`}>
        <Button size="small" className="text-sm">
          {t('lbl.go')} <RightOutlined className="mr-0 text-xs" />
        </Button>
      </Link>
    </>
  );

  return (
    <>
      {!isDrawer &&
        <h3 className="pl-10 pr-10 mt-10">
          <UnorderedListOutlined className="mr-5" />
          {t('lbl.categories')}
        </h3>
      }
      <ScrollField maxHeight="calc(100% - 120px)">
        <Spin spinning={loading}>
          <Empty isEmpty={!get(data, 'result.set', []).length > 0} className="pt-20">
            <Menu mode="inline">
              {get(data, 'result.set', []).sort((a, b) => (parseInt(a.sort_order) > parseInt(b.sort_order)) ? 1 : ((parseInt(b.sort_order) > parseInt(a.sort_order)) ? -1 : 0)).map(x => (
                <Menu.SubMenu key={x.id} title={<Title text={t(x.code)} id={x.id} />}>
                  {get(x, 'children', []).map(y => (
                    <Menu.SubMenu key={y.id} title={<Title text={y.name} id={y.id} />}>
                      {get(y, 'surveys', []).map(z => (
                        <Menu.Item key={z.id}>
                          <Link to={`/survey/${z.id}`}>
                            {z.title}
                          </Link>
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  ))}
                </Menu.SubMenu>
              ))}
            </Menu>
          </Empty>
        </Spin>
      </ScrollField>
      {account &&
        <>
          <Divider />
          <NewCategory />
        </>
      }
    </>
  );
};