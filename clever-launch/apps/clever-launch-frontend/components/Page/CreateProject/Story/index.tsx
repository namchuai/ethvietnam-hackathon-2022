import { Grid } from '@nextui-org/react';
import Section from 'apps/clever-launch-frontend/components/Common/AppSection';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import FontFamily from '@tiptap/extension-font-family';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import MenuBar from '../Components/ToolbarEditor';
import Placeholder from '@tiptap/extension-placeholder';
import AppDropDown from '../../../Common/AppDropDown';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';
import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect, useState } from 'react';
import ButtonSubmit from '../Components/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  getPendingProject,
  updateProjectPending,
} from 'apps/clever-launch-frontend/services/create-project';
import { useRouter } from 'next/router';
import { TABS } from 'apps/clever-launch-frontend/constants/tabs';
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

interface IStoryProps {
  story?: any;
  setStory?: any;
  activeTab?: any;
  setActiveTab?: any;
  projectId?: string;
}

const schema = yup.object().shape({
  story: yup.string().required(),
});

function Story({ projectId }: IStoryProps) {
  const [story, setStory] = useState('');
  const [isUpload, setIsUpload] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Document,
      Paragraph,
      Text,
      FontFamily,
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
    parseOptions: {
      preserveWhitespace: 'full',
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

  const onSubmit = async (data) => {
    try {
      const { status } = await updateProjectPending(data);
      if (status == 200 || status == 201) {
        router.push({
          pathname: '/create-project/[id]',
          query: { id: `${projectId}`, tab: TABS.VERIFICATION },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetProjectPending = async () => {
    try {
      await getPendingProject({}).then(({ data }) => {
        setStory(data?.story), setValue('story', data?.story);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!editor?.isDestroyed) {
      editor?.commands?.setContent(story, false);
    }
  }, [story]);

  useEffect(() => {
    handleGetProjectPending();
  }, []);

  return (
    <>
      <form onSubmit={() => handleSubmit(onSubmit)}>
        <Section>
          <Grid.Container gap={4} justify="center">
            <Grid xs={12} md={8}>
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[23px]">
                    <AppDropDown
                      selectList={arrFontFamily}
                      editor={editor}
                      width="240px"
                      placeholder="Font Family"
                      height="44px"
                      handleSelect={handleSelect}
                    />
                    <MenuBar
                      editor={editor}
                      pid={id}
                      setIsUpload={setIsUpload}
                    />
                  </div>

                  {isUpload && (
                    <SpinnerContainer className="flex justify-center items-center ">
                      <img
                        src="/assets/create-project/processing.svg"
                        alt="processingIcon"
                      />
                    </SpinnerContainer>
                  )}
                </div>
                <div
                  className={`py-[10px] px-[14px] border
                   border-[#E4E7EC]
                    h-[549px] mt-[8px]
                    ${
                      errors?.story?.message &&
                      editor?.state?.doc?.textContent?.length == 0
                        ? `border-[#F31260]`
                        : ``
                    }
                    `}
                >
                  <EditorContent editor={editor} />
                </div>
              </div>
            </Grid>
            <Grid xs={12} md={4}>
              <div>
                <p className="font-normal text-[18px] text-[#212121] mb-[20px]">
                  Project description
                </p>
                <div>
                  <p className="font-normal text-[16px] text-[#4D4D4D]">
                    Please describe what you're raising funds for, why you care
                    about it, how you plan to make it happen, and who you are.
                  </p>
                  <p className="font-normal text-[16px] text-[#4D4D4D]">
                    Your description should tell backers everything they need to
                    know. If possible, include images or videos to show them
                    what your project is all about and what rewards look like
                  </p>
                </div>
              </div>
            </Grid>
          </Grid.Container>
        </Section>

        <ButtonSubmit onClick={handleSubmit(onSubmit)} />
      </form>
    </>
  );
}

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

export default Story;
