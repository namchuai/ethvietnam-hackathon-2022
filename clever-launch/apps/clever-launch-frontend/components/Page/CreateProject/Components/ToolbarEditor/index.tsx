import { API_URL } from 'apps/clever-launch-frontend/constants';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';

interface IProps {
  files?: any;
  setFiles?: any;
  pid?: any;
  setIsUpload?: any;
}

const SingleImage = ({ file, onUpload, pid, setIsUpload }): JSX.Element => {
  const uploadFile = (file) => {
    const actions = {
      AVATAR: '/users/upload/avatar',
      INTRO: '/projects/upload/medium',
    };
    const url = `${API_URL}${actions['INTRO']}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', pid);
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
        setIsUpload(true);
        const url = await uploadFile(file);
        setIsUpload(false);
        onUpload(file, url);
      }
      upload();
    }
  }, []);
  return <></>;
};

const UploadImage = ({
  files,
  setFiles,
  pid,
  setIsUpload,
}: IProps): JSX.Element => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const acceptedFilesData = acceptedFiles.map((file) => ({
        file,
        url: null,
      }));
      setFiles((current) => [...current, ...acceptedFilesData]);
    },
    [files.length]
  );

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { accepted: ['image/png', 'image/jpeg'] },
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
      <label htmlFor="upload" {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <img
          className="icon"
          style={{ cursor: 'pointer' }}
          src="/assets/create-project/insertImg.svg"
          alt=""
        />
      </label>

      {files?.map((file) => (
        <SingleImage
          file={file.file}
          onUpload={onUpload}
          pid={pid}
          setIsUpload={setIsUpload}
        />
      ))}
    </>
  );
};

const MenuBar = ({ editor, pid, setIsUpload }) => {
  const [fileImage, setFileImage] = useState([]);
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  useEffect(() => {
    fileImage.length > 0 &&
      editor
        ?.chain()
        .focus()
        .setImage({ src: fileImage[fileImage.length - 1]?.url ?? '' })
        .run();
  }, [fileImage]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-[24px] items-end">
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <img className="icon" src="/assets/create-project/B.svg" alt="" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <img className="icon" src="/assets/create-project/I.svg" alt="" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <img className="icon" src="/assets/create-project/H1.svg" alt="" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <img className="icon" src="/assets/create-project/H2.svg" alt="" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <img
          className="icon"
          src="/assets/create-project/blockquote.svg"
          alt=""
        />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          setLink();
        }}
        className={editor.isActive('link') ? 'is-active' : ''}
      >
        <img className="icon" src="/assets/create-project/link.svg" alt="" />
      </button>

      <UploadImage
        files={fileImage}
        setFiles={setFileImage}
        pid={pid}
        setIsUpload={setIsUpload}
      />

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <img className="icon" src="/assets/create-project/bullet.svg" alt="" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <img
          className="icon"
          src="/assets/create-project/orderedList.svg"
          alt=""
        />
      </button>
    </div>
  );
};

export default MenuBar;
