import axios from 'axios';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { API_URL } from '../../../constants';
import { Progress } from '@nextui-org/react';
import { Loading } from '@nextui-org/react';
import className from 'classnames';

const SingleFileUploadWithProgress = ({
  file,
  url,
  onUpload,
  onDelete,
  type,
  isPrivate,
  pid,
}) => {
  const [progress, setProgress] = useState(0);

  const uploadFile = (file, onProgress) => {
    const actions = {
      INTRO: '/projects/upload/medium',
      AVATAR: '/users/upload/avatar',
      EKYC_SELFIE: '/users/upload/ekyc/selfie',
      EKYC_BACK: '/users/upload/ekyc/back',
      EKYC_FRONT: '/users/upload/ekyc/front',
      PITCH_DECK: '/projects/upload/pitch-deck',
    };
    const url = `${API_URL}${actions[type]}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', pid);

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: function (progressEvent) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          },
        });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };

  useEffect(() => {
    if (file) {
      // eslint-disable-next-line no-inner-declarations
      async function upload() {
        const url = await uploadFile(file, setProgress);
        onUpload(file, url);
      }

      upload();
    }
  }, []);

  return (
    <>
      {url ? (
        <div onClick={(e) => e.stopPropagation()}>
          <div
            className={`w-full flex justify-between gap-[10px] items-start px-[10px] py-[20px] ${
              isPrivate && 'bg-[#77777717] rounded-[8px]'
            }`}
          >
            {isPrivate ? (
              <>
                <img src={'/assets/icon/default-upload.svg'} className={''} />
                <div className={'flex-1 flex-col'}>
                  <span>default.jpg</span>
                  <br />
                  <span>
                    {file ? (file?.size / (1024 * 1024)).toFixed(2) : ''}
                    {file?.size && 'MB'}
                  </span>
                  <Progress size={'sm'} color="primary" value={progress} />
                </div>
                <div className={''} role="overlay">
                  <img
                    src={'/assets/icon/trash.svg'}
                    onClick={() => onDelete(url)}
                  />
                </div>
              </>
            ) : (
              <div className={'relative w-full'}>
                <img src={url} className={'center-cropped'} />
                <div
                  className={'absolute top-[5px] right-[5px] cursor-pointer'}
                  role="overlay"
                >
                  <img
                    src={'/assets/icon/trash.svg'}
                    onClick={() => onDelete(url)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={'flex items-center justify-center'}
          onClick={(e) => e.stopPropagation()}
        >
          <Loading size="xs" />
        </div>
      )}
    </>
  );
};

interface IUploader {
  files: any;
  setFiles: any;
  errors?: any;
  limit?: any;
  type?: any;
  isPrivate?: boolean;
  name?: any;
  isAcceptAllFile?: boolean;
  pid?: any;
}

export default function ImageUploader({
  files,
  setFiles,
  errors = undefined,
  isPrivate = false,
  limit = 1,
  name,
  type,
  isAcceptAllFile = false,
  pid,
}: IUploader) {
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
        .slice(0, limit - files.length)
        .map((file) => ({ file, url: null }));
      setFiles((current) => [...current, ...acceptedFilesData]);
    },
    [files.length]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { accepted: isAcceptAllFile ? [] : ['image/png', 'image/jpeg'] },
    disabled: files.length >= 1,
  });

  return (
    <div
      {...getRootProps({ maxFiles: 1 })}
      className={className(
        `pt-[16px] w-full flex h-[156px] items-center justify-center  px-[16px] pb-[16px] rounded-[8px] border-dashed border border-[#E4E7EC] w-full`,
        [errors ? 'border-[red]' : '']
      )}
    >
      {files.length === 0 && (
        <div className="w-full flex-none justify-center mb-[12px] flex-col items-center">
          <img
            className={'w-[45px] m-auto'}
            src="/assets/create-project/upload-icon.svg"
            alt=""
          />
          <input {...getInputProps()} />
          <div className=" w-full flex justify-center text-[14px] font-normal text-center">
            <span className="font-medium text-[#1F4690] cursor-pointer">
              Click to upload &nbsp;
            </span>
            {`${name ? name : 'or drag and drop'}`}
          </div>

          <div className="flex justify-center text-[14px] font-normal text-center">
            PNG, JPG or GIF (no larger than 20MB)
          </div>
        </div>
      )}

      <div className={`w-full`}>
        {files?.map((file, idx) => (
          <SingleFileUploadWithProgress
            key={idx}
            file={file.file}
            type={type}
            url={file.url}
            onUpload={onUpload}
            onDelete={onDelete}
            isPrivate={isPrivate}
            pid={pid}
          />
        ))}
      </div>
    </div>
  );
}
