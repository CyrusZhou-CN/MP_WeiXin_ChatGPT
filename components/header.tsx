import Head from 'next/head'
import type { FC } from 'react'
import Image from "next/image";
import { Avatar, Layout, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, GithubOutlined } from '@ant-design/icons';
import LanguageSelect from './languageSelect';
import { signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

const { Header: AntdHeader } = Layout;

type Props = {
  heading: string
  title: string
}

export const Header: FC<Props> = ({ heading, title }) => {
  const { t } = useTranslation('common');

  const { status, data: session } = useSession();
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
            {status === "authenticated" && (
              <Menu.SubMenu key="sub1" icon={session?.user?.image} title={session?.user?.name}>
                <Menu.Item  key="3" icon={<LogoutOutlined />} onClick={() => signOut()}>{t('Sign Out')}</Menu.Item>
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
