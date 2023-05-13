import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { BackTop, Layout } from 'antd';
import { Analytics } from '@vercel/analytics/react';
const { Footer: AntFooter } = Layout;

export const Footer: FC = () => {
  const { t } = useTranslation('footer');

  return (
    <>
      <div style={{ height: '50px' }}></div>
      <AntFooter style={{ padding: 10, position: 'fixed', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
        <p style={{ margin: 0 }}>{t('description')}</p>
        <BackTop style={{ bottom: 50 }} />
      </AntFooter>
      <Analytics />
    </>
  );
};
