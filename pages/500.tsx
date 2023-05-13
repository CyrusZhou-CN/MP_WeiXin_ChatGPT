import  Layout  from "../components/layout";
import { useTranslation } from "next-i18next";
import Link from 'next/link';

import { getStaticProps } from 'components/i18nServerSideProps';
export { getStaticProps };
export default function Custom500() {
  const { t } = useTranslation();
  return (
    <>
      <Layout heading={t('heading')} title={t('title')} >
          <h1>{t('500')}</h1>
          <Link href="/">
            {t('backToHome')}
          </Link>
      </Layout>
    </>
  );
}