import Image from 'next/image';

interface IAppImageLoader {
  url: string;
  width?: number;
  height?: number;
}

const AppImageLoader = ({ url }: IAppImageLoader) => {
  return <Image src={url} alt="Picture of the author" layout="fill" />;
};

export default AppImageLoader;
