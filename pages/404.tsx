import { Footer } from "components/footer";
import { Header } from "components/header";
import { useTranslation } from "next-i18next";
import Link from 'next/link';

import { getStaticProps } from 'components/i18nServerSideProps';
export { getStaticProps };
export default function Custom404() {
  const { t } = useTranslation();
  return (
    <>
      <Header heading={t('heading')} title={t('title')} />
      <div className="container">
        <div className="content">
          <h1>{t('404')}</h1>
          <Link href="/">
            {t('backToHome')}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}