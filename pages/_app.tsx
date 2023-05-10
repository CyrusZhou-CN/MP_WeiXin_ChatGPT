import '../styles/global.css';
import APP, { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SessionProvider } from "next-auth/react"

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const router = useRouter();
  const { i18n } = useTranslation();
  useEffect(() => {
    const handleLanguageChange = (lang: string) => {
      router.push(router.asPath, router.asPath, { locale: lang });
    };
    try {
      i18n.on('languageChanged', handleLanguageChange);

      return () => {
        i18n.off('languageChanged', handleLanguageChange);
      };
    } catch (e) {

    }
  }, [i18n, router]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
export default appWithTranslation(MyApp);


