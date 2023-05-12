import fs from "fs";
import ReactMarkdown from "react-markdown"
import markdownStyles from "../styles/markdown-styles.module.css";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next/types";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import syncModels from "db/sync-models";
import weixinImage from "../public/images/weixin.jpg";
import wechatDebugImage from "../public/images/wechat_debug.jpg";
import nextImage from "../public/images/next.jpg";
import { README_md, README_IT_md, README_EN_md } from "../db/readme";
const components = {
  img: (image: any) => {

    console.log('image', image.src.split(".")[1]);
    if (image.src.includes('weixin.jpg')) {
      return <Image src={weixinImage} alt={image.alt} />
    }
    if (image.src.includes('wechat_debug.jpg')) {
      return <Image src={wechatDebugImage} alt={image.alt} />
    }
    if (image.src.includes('next.jpg')) {
      return <Image src={nextImage} alt={image.alt} />
    }
    let src = image.src
    return <Image src={src} alt={image.alt} />
  },
  a: ({ href, children }: any) => {
    let target = '_blank';
    switch (href) {
      case 'README.md':
        target = '_self';
        href = '/cn'
        break;
      case 'README.IT.md':
        target = '_self';
        href = '/it'
        break;
      case 'README.EN.md':
        target = '_self';
        href = '/en'
        break;
      default:
        break;
    }
    return (
      <a href={href} target={target} rel="noopener noreferrer">
        {children}
      </a>
    );
  },
}
type Props = {
  markdown: string;
}
const HomePage = ({ markdown }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Header heading={t('heading')} title={t('title')} />
      <div className="container">
        <div className="content">
          <ReactMarkdown
            className={markdownStyles["markdown"]}
            children={markdown}
            components={components}
            skipHtml={false}
            sourcePos={true}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  await syncModels();  
  console.log('locale', locale);
  const translations = await serverSideTranslations(locale ?? 'cn', [
    'common',
    'footer',
  ]);
  try {
    let markdown = '';
    switch (locale) {
      case "cn":
        markdown = README_md;
        break;
      case "it":
        markdown = README_IT_md;
        break;
      case "en":
        markdown = README_EN_md;        
        break;
      default:
        markdown = README_md;
        break;
    }
    return {
      props: {
        markdown, ...translations,
      }
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        markdown: '',
        ...translations,
      }
    };
  }
}
export default HomePage;

