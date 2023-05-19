import '../styles/global.css';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import i18n from '../components/i18n' // 导入你的 i18n 配置
import { initReactI18next } from 'react-i18next';
import { SWRConfig } from "swr";
import fetchJson from "../lib/fetchJson";
import { useEffect } from 'react';

// 初始化 react-i18next
i18n.use(initReactI18next).init({
  fallbackLng: 'cn',
  lng: 'cn',
  debug: process.env.NODE_ENV === 'development'
})
const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
      router.push(router.asPath, router.asPath, { locale: storedLang });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleLanguageChange = (lang: string) => {
      router.push(router.asPath, router.asPath, { locale: lang });
      localStorage.setItem('lang', lang);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, router]);
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err: any) => {
          console.error(err);
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  )
}

const MyAppWithTranslation = appWithTranslation(MyApp);

export default MyAppWithTranslation;