import { Avatar } from '@nextui-org/react';
import { API_URL } from 'apps/clever-launch-frontend/constants';
import axios from 'axios';
import { useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoIosClose } from 'react-icons/io';

interface IPropsAvatarUpload {
  files: any;
  setFiles: any;
  errors?: any;
  limit?: any;
  type?: any;
  isPrivate?: boolean;
}

const SingleAvatar = ({ file, onUpload, url, onDelete }) => {
  const uploadFile = (file) => {
    const actions = {
      AVATAR: '/users/upload/avatar',
    };
    const url = `${API_URL}${actions['AVATAR']}`;
    const formData = new FormData();
    formData.append('image', file);
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };

  useEffect(() => {
    if (file) {
      async function upload() {
        const url = await uploadFile(file);
        onUpload(file, url);
      }
      upload();
    }
  }, []);

  return (
    <div className="w-fit relative">
      <div
        className=" absolute z-[3] h-[25px] w-[25px]
      rounded-[50%] bg-[#E4E7EC] flex justify-center
      cursor-pointer
      items-center top-0 right-0"
        onClick={() => onDelete(url)}
      >
        <IoIosClose size={'1.5rem'} />
      </div>
      <Avatar src={url} css={{ size: '$20', zIndex: 1 }} />
    </div>
  );
};

const AvatarUploader = ({ files, setFiles }: IPropsAvatarUpload) => {
  const onDelete = (url) => {
    setFiles((curr) => curr.filter((file) => file.url !== url));
  };

  const onUpload = (file, url) => {
    setFiles((curr) =>
      curr.map((fw) => {
        if (fw.file === file) {
          return { ...fw, url };
        }
        return fw;
      })
    );
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const acceptedFilesData = acceptedFiles
        .slice(0, 1 - files.length)
        .map((file) => ({ file, url: null }));
      setFiles((current) => [...current, ...acceptedFilesData]);
    },
    [files.length]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { accepted: ['image/png', 'image/jpeg'] },
    disabled: files.length >= 1,
  });

  const baseStyle = {
    width: 'fit-content',
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  return (
    <>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {files.length === 0 && (
          <Avatar
            src={'./assets/icon/avatar-default.svg'}
            css={{ size: '$20', zIndex: 1, cursor: 'pointer' }}
          />
        )}
      </div>
      {files?.map((file, idx) => (
        <SingleAvatar
          key={idx}
          file={file.file}
          url={file.url}
          onUpload={onUpload}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export default AvatarUploader;
