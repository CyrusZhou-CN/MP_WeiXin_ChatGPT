import Head from 'next/head'
import type { FC } from 'react'
import { Layout, Menu, MenuProps } from 'antd';
import { LogoutOutlined, GithubOutlined } from '@ant-design/icons';
import LanguageSelect from './languageSelect';
import { useTranslation } from 'next-i18next';
import useUser from '../lib/useUser';
import { useRouter } from 'next/router';
import fetchJson from '../lib/fetchJson';
const { Header: AntdHeader } = Layout;

type Props = {
  heading: string
  title: string
}
export const Header: FC<Props> = (props) => {
  const { t } = useTranslation('common');
  const { heading, title } = props;
  const { user, mutateUser } = useUser();
  const router = useRouter(); 
  const handleLogout: MenuProps['onClick'] = async (e) => {
    mutateUser(
      await fetchJson("/api/auth/logout", { method: "POST" }),
      false,
    );
    router.reload(); // 重新加载当前页面
  };
  
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="header">
        <AntdHeader className="header-content" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2>{heading}</h2>
          </div>
          <Menu style={{ width: '320px', display: 'flex', alignItems: 'center' }}
            theme="dark" mode="horizontal" defaultSelectedKeys={[]}>
            <Menu.Item key="1"><LanguageSelect /></Menu.Item>
            {user && user.isLoggedIn && (
              <Menu.SubMenu key="sub1" icon={user?.image} title={user?.name || "error"}>
                <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout} >{t('Sign Out')}</Menu.Item>
              </Menu.SubMenu>
            )}
            <Menu.Item key="2" >
              <a href="https://github.com/CyrusZhou-CN/MP_WeiXin_ChatGPT" target="_blank" rel="noopener noreferrer">{<GithubOutlined />}</a>
            </Menu.Item>
          </Menu>
        </AntdHeader>
      </div>
      <div style={{ height: '80px' }}></div>
    </>
  );
}
