import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown"
import markdownStyles from "../styles/markdown-styles.module.css";
import { SetStateAction, useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import { useTranslation } from "react-i18next";
import { GetStaticProps } from "next/types";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import syncModels from "db/sync-models";
import { Layout } from 'antd';

const { Content } = Layout;
function getOriginalImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = src;
    img.onerror = reject;
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
  });
}
//原始图片尺寸
const MyImage = (props: ImageProps) => {
  let imageSrc = props.src.toString();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    getOriginalImageSize(imageSrc).then((size: SetStateAction<{ width: number; height: number; }>) => setImageSize(size));
  }, [imageSrc]);
  if (imageSrc.startsWith('./public/images')) {
    imageSrc = imageSrc.replace('./public/images', '/images');
  }
  const { src: _, ...otherProps } = props;
  return (
    <Image src={imageSrc} width={imageSize.width} height={imageSize.height} {...otherProps} />
  );
};

const components = {
  img: (image: any) => {
    let src = image.src
    return <MyImage
      src={src}
      alt={image.alt}
    />
  },
  a: ({ href, children }: any) => {
    console.log('href:', href);
    let target = '_blank';
    switch (href) {
      case 'README.md':
        target = '_self';
        href = '/'
        break;
      case 'README.IT.md':
        target = '_self';
        href = 'it'
        break;
      case 'README.EN.md':
        target = '_self';
        href = 'en'
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
  const translations = await serverSideTranslations(locale ?? 'cn', [
    'common',
    'footer',
  ]);
  try {
    let readme_locale = locale ? (locale === 'cn' ? `README.md` : `README.${locale}.md`) : `README.md`;
    console.log(readme_locale);
    const fullPath = path.join(process.cwd(), readme_locale);
    const markdown = await fs.promises.readFile(fullPath, 'utf-8');
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

