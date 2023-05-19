import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    locale = locale || 'cn';
    return {
      props: {
        ...await serverSideTranslations(locale, ['common']),
      },
    };
  };
const Logout = () => {
    
  const { t } = useTranslation('common');
    useEffect(() => {
        const logOut = async () => {
            let response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
        }
        logOut();
    }, []);

    return <p>{t('Logging Out')}</p>
}

export default Logout;