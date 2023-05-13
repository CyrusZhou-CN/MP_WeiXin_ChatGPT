import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Header } from 'components/header';
import { Footer } from 'components/footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout, Menu } from 'antd';
import ReplyCachePage from '../../components/page/replyCachePage';
import SystemLogPage from '../../components/page/systemLogPage';
import UserPage from '../../components/page/userPage';
import { GetStaticProps } from 'next';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale = locale || 'cn';
  return {
      props: {
          ...await serverSideTranslations(locale, ['common', 'footer', 'admin']),
      },
  };
};

export default function ServerDashboardPage({ }: any) {
  const { t } = useTranslation('admin');
  type Page = 'dashboard' | 'history' | 'systemLog' | 'users';

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleMenuClick = (key: Page) => {
    setCurrentPage(key);
  };

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider style={{ color: '#000000', backgroundColor: '#ffffff', marginTop: '80px', height: `calc(100vh - 80px)`, position: 'absolute', left: 0, zIndex: 1 }}>
          <Menu mode="inline" theme="dark" defaultOpenKeys={['cache', 'logs']}>
            <Menu.Item key="dashboard" onClick={() => handleMenuClick('dashboard')}>
              {t('dashboard')}
            </Menu.Item>
            <SubMenu key="cache" title={t('chatgpt')}>
              <Menu.Item key='history' onClick={() => handleMenuClick('history')}>
                {t('history')}
              </Menu.Item>
            </SubMenu>
            <SubMenu key="logs" title={t('system')}>
              <Menu.Item key='systemLog' onClick={() => handleMenuClick('systemLog')}>
                {t('systemLog')}
              </Menu.Item>
              <Menu.Item key='users' onClick={() => handleMenuClick('users')}>
                {t('users')}
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header heading={t(currentPage)} title={t(currentPage)} />
          <Content style={{ margin: '0 16px' }}>
            {currentPage === 'dashboard' && <div>{t('dashboard')}</div>}
            {currentPage === 'history' && <ReplyCachePage />}
            {currentPage === 'systemLog' && <SystemLogPage />}
            {currentPage === 'users' && <UserPage />}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </>
  );
}