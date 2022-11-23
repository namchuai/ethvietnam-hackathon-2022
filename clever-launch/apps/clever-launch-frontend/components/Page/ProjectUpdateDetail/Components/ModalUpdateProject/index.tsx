import { Avatar, Grid } from '@nextui-org/react';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  getProjectDetail,
  getStoryProject,
  updateProject,
} from 'apps/clever-launch-frontend/services/project';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import FontFamily from '@tiptap/extension-font-family';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';
import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';
import Section from 'apps/clever-launch-frontend/components/Common/AppSection';
import AppButton from 'apps/clever-launch-frontend/components/Common/AppButton';
import AppDropDown from 'apps/clever-launch-frontend/components/Common/AppDropDown';
import MenuBar from '../../../CreateProject/Components/ToolbarEditor';
import WrapModalReward from 'apps/clever-launch-frontend/components/Common/WrapModalReward';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  img {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface Idata {
  creatorId?: string;
  id?: string;
  title?: string;
  subTitle?: string;
  introType?: string;
  introUrl?: string;
  fundRaisingMethod?: string;
  fundingGoal?: string;
  durationInDay?: number;
  pitchDeckUrl?: string;
  tags?: Array<any>;
  walletAddress?: string;
  contactEmail?: string;
  updatedAt?: number;
  createdAt?: number;
  status?: string;
  featuredPoint?: number;
  fundedAmount?: string;
  backerCount?: number;
  creatorFirstName?: string;
  creatorLastName?: string;
  creatorProfileName?: string;
}

const schema = yup.object().shape({
  story: yup.string().required(),
});

const ModalProjectUpdate = ({ closeHandler, visible }): JSX.Element => {
  const route = useRouter();
  const [isUpload, setIsUpload] = useState(false);

  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
  });

  const { pid } = route.query as { pid?: string };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Document,
      FontFamily,
      Paragraph,
      Text,
      TextStyle,
      BulletList,
      OrderedList,
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'bulletList list-disc  pl-[22px]',
        },
        itemTypeName: 'listItem',
      }),

      Heading.configure({ levels: [1, 2] }).extend({
        levels: [1, 2],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const classes = {
            1: 'text-[20px]',
            2: 'text-[18px]',
          };
          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ];
        },
      }),

      OrderedList.configure({
        HTMLAttributes: {
          class: 'orderList list-decimal pl-[22px]',
        },
      }),

      Blockquote.configure({
        HTMLAttributes: {
          class:
            'blockquateClass pl-[12px] ml-[10px] border-l-[3px]  border-l-[#B4B4B4]',
        },
      }),

      Placeholder.configure({
        placeholder: 'Enter your story',
        emptyNodeClass:
          ' first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      Link.configure({
        protocols: ['ftp', 'mailto', 'http'],
        autolink: false,
        openOnClick: true,
        HTMLAttributes: {
          class:
            'linkClass text-decoration-line: underline cursor-pointer text-[#E8AA42]',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'my-custom-class',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    content: ``,
    onUpdate({ editor }) {
      const isEmpty = editor.state.doc.textContent.length !== 0;
      setValue('story', isEmpty ? editor.getHTML() : '');
    },
  });

  const handleSelect = (value: any) => {
    const handleChangeFamily = (value: any) => {
      editor.chain().focus().setFontFamily(value).run();
    };
    handleChangeFamily(value);
  };

  const onSubmit = async (dataPost) => {
    try {
      const { status } = await updateProject({
        projectId: pid,
        content: dataPost.story,
      });
      if (status == 200 || status == 201) {
        closeHandler();
        toast.info('Update successfully! ', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!editor?.isDestroyed) {
      editor?.commands?.setContent('', false);
    }
    clearErrors('story');
  }, [visible]);

  return (
    <>
      <ToastContainer />
      <WrapModalReward
        title={'Add new update'}
        closeHandler={closeHandler}
        visible={visible}
        width={'100vw'}
      >
        <form onSubmit={() => handleSubmit(onSubmit)}>
          <Section>
            <div className="flex items-center gap-[23px] pl-[12px] mt-[30px]">
              <AppDropDown
                selectList={arrFontFamily}
                editor={editor}
                width="240px"
                placeholder="Font Family"
                height="44px"
                handleSelect={handleSelect}
              />
              <MenuBar editor={editor} pid={pid} setIsUpload={setIsUpload} />
              {isUpload && (
                <SpinnerContainer className="flex justify-center items-center ">
                  <img
                    src="/assets/create-project/processing.svg"
                    alt="processingIcon"
                  />
                </SpinnerContainer>
              )}
            </div>
            <Grid.Container gap={2} justify="flex-start">
              <Grid xs={12} md={8} css={{ textAlign: 'left' }}>
                <div
                  className={`w-full h-[550px] p-[10px]
                ${
                  errors?.story?.message &&
                  editor?.state?.doc?.textContent?.length == 0
                    ? `border-[#F31260]`
                    : ``
                }
                border border-[#E4E7EC]`}
                >
                  <div className="w-full">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </Grid>
            </Grid.Container>
          </Section>

          <Section>
            <div className="pl-[12px]">
              <AppButton
                bgCustom={'#E8AA42'}
                css={{ width: '200px' }}
                onClick={handleSubmit(onSubmit)}
              >
                Post new update
              </AppButton>
            </div>
          </Section>
        </form>
      </WrapModalReward>
    </>
  );
};

const arrFontFamily = [
  {
    name: 'Be Vietnam Pro',
    value: 'Be Vietnam Pro',
  },
  {
    name: 'Inter',
    value: 'Inter',
  },
  {
    name: 'monospace',
    value: 'monospace',
  },
  {
    name: 'cursive',
    value: 'cursive',
  },
];

export default ModalProjectUpdate;
