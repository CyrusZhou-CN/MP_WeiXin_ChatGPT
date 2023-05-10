import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    locale = locale || 'cn';
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'footer']),
        },
    };
};
