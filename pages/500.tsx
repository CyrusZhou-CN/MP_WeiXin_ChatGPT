import Layout from "../components/layout";
import { useTranslation } from "next-i18next";
import Link from 'next/link';

import { getStaticProps } from 'components/i18nServerSideProps';
import { useRouter } from "next/router";
export { getStaticProps };
export default function Custom500({ locale }: any) {
  const { t } = useTranslation();
  const router = useRouter();
  // 获取上一个页面的 URL
  const previousPageURL = router.query.from as string || `/${locale}`;
  return (
    <>
      <Layout heading={t('heading')} title={t('title')} >
        <h1>{t('500')}</h1>
        <Link href={previousPageURL}>
          {t('goBack')}
        </Link>
      </Layout>
    </>
  );
}