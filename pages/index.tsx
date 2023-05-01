import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown"
import markdownStyles from "../styles/markdown-styles.module.css";
import { SetStateAction, useEffect, useState } from "react";
import Image, { ImageProps} from "next/image";


function getOriginalImageSize(src: string ):  Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
  const img = new window.Image();  
  img.src = src;
  img.onerror = reject;
  img.onload = () => {
    resolve({width: img.naturalWidth, height: img.naturalHeight});
  };
});
}
//原始图片尺寸
const MyImage = (props: ImageProps) => {  
  let imageSrc  = props.src.toString();
  const [imageSize, setImageSize] = useState({width: 0, height: 0});
  useEffect(() => {
    getOriginalImageSize(imageSrc).then((size: SetStateAction<{ width: number; height: number; }>) => setImageSize(size));
  }, [imageSrc]);
  if (imageSrc .startsWith('./public/images')){
    imageSrc  = imageSrc .replace('./public/images', '/images');
  }
  const { src: _, ...otherProps } = props;
  return (
      <Image src={imageSrc } width = {imageSize.width} height = {imageSize.height} {...otherProps} />
  );
};
const components = {
  img: (image: any) => {
    let src = image.src    
    return <MyImage 
        src={src} 
        alt={image.alt}
    />
  }
}
type Props = {
  markdown: string;
}
const Home = ({ markdown }: Props) => {

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-screen-2xl bg-white p-8 rounded-md shadow-lg">
      <ReactMarkdown
        className={markdownStyles["markdown"]}
        children={markdown }
        components={components}
      />
      </div>
    </div>
  );
};
export async function getStaticProps() {
  try {
    const fullPath = path.join(process.cwd(), 'README.md');
    const markdown = await fs.promises.readFile(fullPath, 'utf-8');
    return { props: { markdown } };
  } catch (error) {
    console.error(error);
    return { props: { markdown: '' } };
  }
}
export default Home;