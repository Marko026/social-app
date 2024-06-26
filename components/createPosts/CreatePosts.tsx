'use client';
import {
  createContent,
  createMeetupContent,
  createPodcastContent,
  updateContent,
  updateMeetupContent,
  updatePodcastContent,
} from '@/api/mutation';
import { fetchCreateGroups, fetchTags } from '@/api/queries';
import RHFInput from '@/components/RHFInputs/RHFInput';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { postTypes } from '@/constants';
import { useTheme } from '@/context/ThemeProvider';
import { cn } from '@/lib/utils';
import {
  IContent,
  IContentDTO,
  IPutMeetupDTO,
  IPutPodcastDTO,
  IPutPostDTO,
  postSchema,
} from '@/lib/validation';
import { EContentType } from '@/types/content';
import { ISelectGroup, ITags } from '@/types/group';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Select from '@radix-ui/react-select';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import { format } from 'date-fns';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ReactSelect, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useDebounce } from 'use-debounce';
import Preview from '../preview/Preview';
import { Input } from '../ui/input';

import { revalidate } from '@/lib/actions/revalidate';

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
};

type ContentProps = {
  authorId?: string;
  allGroups?: ISelectGroup[];
  allTags?: ITags[];
  editType?: string;
  editPost: IContentDTO;
  viewerId: string;
};

const CreatePosts = ({ authorId, editPost, viewerId }: ContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [q, setQ] = useState('');
  const [title, setTitle] = useState('');
  const { mode } = useTheme();

  const [debouncedQ] = useDebounce(q, 500);
  const [debouncedTitle] = useDebounce(title, 500);

  const editorRef = useRef<any>(null);
  const router = useRouter();

  const resetForm = () => {
    if (editPost) router.push(`/content/${editPost.id}`);
    form.reset();
    form.setValue('groupId', {
      value: '',
      label: '',
    });
    form.setValue('tags', []);
  };

  const {
    data: allGroups = [],
    error: groupsError,
    isLoading: groupsLoading,
  } = useQuery({
    queryKey: ['groups', debouncedQ],
    queryFn: () => fetchCreateGroups(debouncedQ),
  });

  const {
    data: allTags,
    error: tagsError,
    isLoading: tagsLoading,
  } = useQuery({
    queryKey: ['tags', debouncedTitle],
    queryFn: () => fetchTags(debouncedTitle),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: IPutPostDTO) => {
      await createContent(data);
    },
  });

  const { mutateAsync: updateContentMutation } = useMutation({
    mutationFn: async (data: IPutPostDTO) => {
      await updateContent(editPost?.id, data, viewerId);
    },
  });

  const { mutateAsync: createMeetupMutation } = useMutation({
    mutationFn: async (data: IPutMeetupDTO) => {
      await createMeetupContent(data);
    },
  });

  const { mutateAsync: updateMeetupMutation } = useMutation({
    mutationFn: async (data: IPutMeetupDTO) => {
      await updateMeetupContent(editPost.id, data, viewerId);
    },
  });

  const { mutateAsync: createPodcastMutation } = useMutation({
    mutationFn: async (data: IPutPodcastDTO) => {
      await createPodcastContent(data);
    },
  });

  const { mutateAsync: updatePodcastMutation } = useMutation({
    mutationFn: async (data: IPutPodcastDTO) => {
      await updatePodcastContent(editPost.id, data, viewerId);
    },
  });

  const selectGroupOptions = (allGroups as ISelectGroup).groups?.map(
    (group) => ({
      value: group.id,
      label: group.name,
      profileImage: group.profileImage,
      bio: group.bio,
    })
  );
  const selectTagsOptions = (allTags as ITags[])?.map((tag) => ({
    value: tag.id,
    label: tag.title,
  }));

  const form = useForm<IContent>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      authorId: editPost?.authorId ?? authorId,
      title: editPost?.title ?? '',
      type: editPost ? editPost?.type : EContentType.POST,
      groupId: editPost
        ? {
            value: editPost?.group.id,
            label: editPost?.group.name,
          }
        : undefined,
      coverImage: editPost?.coverImage ?? '',
      meetupLocation: editPost?.meetupLocation ?? '',
      meetupDate: editPost?.meetupDate ?? undefined,
      podcastFile: editPost?.podcastFile ?? '',
      podcastTitle: editPost?.podcastTitle ?? '',
      description: editPost?.description ?? '',
      tags: editPost
        ? editPost?.tags.map((tag) => ({ value: tag.id, label: tag.title }))
        : [],
    },
  });

  const watchPostType = form.watch('type');
  const watchCoverImage = form.watch('coverImage');

  console.log(form.formState.errors);

  const onSubmit = async () => {
    const commonData: IPutPostDTO = {
      authorId: form.getValues('authorId'),
      title: form.getValues('title'),
      type: form.getValues('type'),
      groupId: form.getValues('groupId')?.value,
      coverImage: form.getValues('coverImage'),
      description: form.getValues('description'),
      tags: form.getValues('tags').map((tag) => tag.label),
    };

    if (watchPostType === EContentType.POST) {
      const result = await form.trigger([
        'title',
        'coverImage',
        'description',
        'tags',
        'groupId',
      ]);
      if (!result) throw new Error('Form validation failed');

      try {
        setIsLoading(true);
        if (editPost) {
          await updateContentMutation(commonData);
          resetForm();
          toast.success('Post updated successfully!');
        } else {
          setIsLoading(true);
          await mutateAsync(commonData);
          revalidate('/content');
          resetForm();

          toast.success('Post created successfully!');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to create post');
      } finally {
        setIsLoading(false);
      }
    }

    if (watchPostType === EContentType.MEETUP) {
      const result = await form.trigger(['meetupLocation', 'meetupDate']);
      if (!result) throw new Error('Form validation failed');

      try {
        if (editPost) {
          await updateMeetupMutation({
            ...commonData,
            meetupLocation: form.getValues('meetupLocation'),
            meetupDate: form.getValues('meetupDate'),
          });
          resetForm();
          toast.success('Meetup updated successfully!');
        } else {
          setIsLoading(true);
          await createMeetupMutation({
            ...commonData,
            meetupLocation: form.getValues('meetupLocation'),
            meetupDate: form.getValues('meetupDate'),
          });

          resetForm();
          toast.success('Meetup created successfully!');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to create meetup');
      }
    }

    if (watchPostType === EContentType.PODCAST) {
      const result = await form.trigger(['podcastFile', 'podcastTitle']);
      if (!result) return;

      try {
        if (editPost) {
          await updatePodcastMutation({
            ...commonData,
            podcastFile: form.getValues('podcastFile'),
            podcastTitle: form.getValues('podcastTitle'),
          });
          resetForm();
          toast.success('Podcast updated successfully!');
          router.push(`/content/${editPost.id}`);
        } else {
          setIsLoading(true);
          await createPodcastMutation({
            ...commonData,
            podcastFile: form.getValues('podcastFile'),
            podcastTitle: form.getValues('podcastTitle'),
          });
          resetForm();
          toast.success('Podcast created successfully!');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to create podcast');
      } finally {
        setIsLoading(false);
      }
    }
    if (editPost) {
      revalidate(`/content/${editPost.id}`);
      router.push(`/content/${editPost.id}`);
    } else {
    }
  };

  const handlePreview = () => {
    const content = editorRef.current.getContent();
    form.setValue('description', content);
    setIsPreview(true);
  };

  return (
    <div className="w-full">
      {!isPreview ? (
        <Form {...form}>
          <form className="space-y-8 w-full px-3 md:px-0">
            <RHFInput
              className="!placeholder:white-400 p3-medium dark:!placeholder-white-400"
              name="title"
              label="Title"
              placeholder="Write a title of the post"
            />
            <div
              className={`flex flex-col md:flex-row ${form.formState.errors && 'items-center'}  items-center gap-3`}>
              <FormField
                control={form.control}
                defaultValue={EContentType.POST}
                name="type"
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}>
                    <Select.Trigger
                      disabled={editPost && true}
                      {...field}
                      className={`flex w-full md:w-1/4 ${form.formState.errors.groupId ? '!mt-2' : '!mt-6'} capitalize border dark:border-black-700/50 rounded-md px-2 items-center h-12 bg-white-100 dark:bg-black-800 md:justify-center outline-none`}
                      aria-label="Food">
                      <p className=" p3-regular dark:!text-white-400">Create</p>
                      <span className="mx-1 dark:text-white-100/70 text-black-800/60 ">
                        -
                      </span>
                      <p
                        className={`${
                          watchPostType !== EContentType.POST ? 'hidden' : ''
                        } p3-regular !font-bold`}></p>
                      <div className="flex w-full items-center p3-regular justify-between !text-black-800 dark:!text-white-100 !font-bold ">
                        <Select.Value placeholder="Post" />
                        <Image
                          src="/assets/icons/arrow-down-slim.svg"
                          alt="arrow-down"
                          width={12}
                          height={5}
                          className="md:ml-2 mr-2 md:mr-0"
                        />
                      </div>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content
                        position="popper"
                        className="overflow-hidden bg-white">
                        <Select.Viewport className="w-60 mt-3 rounded-md  p-3 bg-light100__dark800">
                          <Select.Group className="flex items-center p-2 rounded-md group duration-200 justify-start">
                            <div className="flex flex-col space-y-3 w-full">
                              {postTypes.map((type, idx) => (
                                <div
                                  key={idx}
                                  className="flex  dark:hover:bg-black-700 px-3 py-1 rounded-md">
                                  <Image
                                    src={type.image}
                                    alt={type.title}
                                    width={24}
                                    height={24}
                                    className="invert dark:invert-0"
                                  />
                                  <SelectItem
                                    value={type.value}
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                    }}
                                    className="p-2 p3-medium capitalize !text-[14px] hover:!text-primary-500">
                                    {type.title}
                                  </SelectItem>
                                </div>
                              ))}
                            </div>
                          </Select.Group>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                )}
              />
              <div className="w-full space-y-2">
                <FormLabel>Select Group</FormLabel>
                <FormField
                  name="groupId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ReactSelect
                          instanceId={field.name}
                          {...field}
                          placeholder="Select a group..."
                          defaultValue={field.value}
                          value={form.watch('groupId')}
                          onInputChange={(value) => setQ(value)}
                          styles={{
                            control: (base) => ({
                              ...base,
                              boxShadow: 'none',
                            }),
                          }}
                          classNames={{
                            input: () =>
                              '!text-[16px] dark:!text-white-100 text-black-800',

                            control: () =>
                              '!border-none dark:bg-black-800 dark:!border-[#393E4F66] md:px-3 h-11',
                            indicatorSeparator: () => '!hidden',
                            dropdownIndicator: () =>
                              '!text-white-400 !w-10 !h-10',
                            option: () =>
                              '!bg-white-100  !py-[18px]  dark:!bg-black-800  dark:!text-white-100 !text-black-800',
                            singleValue: () => 'dark:!text-white-100',
                            menu: () =>
                              'bg-white-100 dark:bg-black-800 !shadow-sm ',
                          }}
                          className="w-full h-full !mt-0 rounded-md dark:!bg-black-800 border dark:border-black-700/50 "
                          isLoading={isLoading}
                          isDisabled={editPost && true}
                          isClearable
                          isSearchable
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption);
                          }}
                          options={selectGroupOptions}
                          components={{ Option }}
                        />
                      </FormControl>
                      <div>
                        {form.formState.errors.groupId?.message && (
                          <p className="text-[14px] text-red-500 dark:text-red-500">
                            {form.formState.errors.groupId.message}
                          </p>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              name="coverImage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    {watchCoverImage ? (
                      <div className="relative w-full h-64">
                        <Image
                          src={watchCoverImage}
                          alt="Cover Image"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-3xl"
                        />
                        <Button
                          type="button"
                          onClick={() => form.setValue('coverImage', '')}
                          className="absolute right-0 top-[-40px] hover:bg-black-700 text-white-400  border dark:border-gray-500 size-8 dark:text-white-100">
                          X
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-64 dashedBorder !text-white-400 rounded-lg flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <CldUploadWidget
                            uploadPreset={
                              process.env.NEXT_PUBLIC_CLOUDINARY_PRESEST_NAME
                            }
                            onSuccess={(res) => {
                              if (res.info && typeof res.info === 'object') {
                                field.onChange(res.info.secure_url);
                              } else {
                                field.onChange(res.info);
                              }
                            }}
                            options={{
                              multiple: false,
                              cropping: true,
                              croppingShowDimensions: true,
                            }}>
                            {({ open }) => (
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  open();
                                }}
                                type="button"
                                className="flex items-center max-w-[200px] dark:bg-black-800 py-2 rounded-lg bg-white-100 gap-3 mb-3">
                                <Image
                                  src={'/assets/icons/upload-icon.svg'}
                                  alt="upload"
                                  width={16}
                                  height={16}
                                />
                                <p className="p3-regular !text-white-300">
                                  Upload a cover image
                                </p>
                              </Button>
                            )}
                          </CldUploadWidget>
                          <p className="p4-regular !text-white-400">
                            Drag & Drop or upload png or jpeg up to 16MB
                          </p>
                        </div>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchPostType === EContentType.MEETUP && (
              <>
                <RHFInput
                  className="!placeholder:white-400 p3-medium dark:!placeholder-white-400"
                  name="meetupLocation"
                  label="Meetup location"
                  placeholder="Write the location of the meetup"
                />
                <Controller
                  control={form.control}
                  name="meetupDate"
                  render={({ field }) => (
                    <Popover>
                      <h3 className="p3-medium"> Meetup date</h3>
                      <PopoverTrigger asChild>
                        <Button
                          className={cn(
                            'justify-start p3-regular font-bold  bg-light100__dark800 border dark:border-black-700/50 px-4 h-11 !mt-2',
                            !field.value && 'text-muted-foreground'
                          )}>
                          <Image
                            src="/assets/icons/calendar-create.svg"
                            alt="calendar"
                            width={18}
                            height={18}
                          />
                          {field.value ? (
                            format(field.value, 'MMMM dd, yyyy hh:mm a')
                          ) : (
                            <span className="text-white-400">
                              Pick a date of the meetup
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 px-2 bg-white-100 dark:bg-black-800 pb-5  rounded-none space-y-3 border-white-400">
                        <Calendar
                          className="bg-white-100 dark:bg-black-800 p4-regular "
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <Input
                          type="time"
                          defaultValue="09:00"
                          min="09:00"
                          max="18:00"
                          onChange={(event) => {
                            const currentDate = new Date(field.value);
                            const newDate = new Date(
                              currentDate.toDateString() +
                                ' ' +
                                event.target.value
                            );

                            field.onChange(newDate);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {form.formState.errors.meetupDate?.message && (
                  <p className="text-[14px] text-red-500 dark:text-red-500">
                    {form.formState.errors.meetupDate.type}
                  </p>
                )}
              </>
            )}
            {watchPostType === EContentType.PODCAST && (
              <>
                <FormField
                  name="podcastFile"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Podcast Audio File</FormLabel>
                      <FormControl>
                        <CldUploadWidget
                          uploadPreset={
                            process.env.NEXT_PUBLIC_CLOUDINARY_PRESEST_NAME
                          }
                          onSuccess={(res) => {
                            if (res.info && typeof res.info === 'object') {
                              field.onChange(res.info.secure_url);
                            } else {
                              field.onChange(res.info);
                            }
                          }}>
                          {({ open }) => (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                open();
                              }}
                              type="button"
                              className="w-full flex !mt-2 justify-start focus-visible:outline-none dark:placeholder:text-[#ADB3CC] placeholder:text-white-400 placeholder:font-normal placeholder:text-sm dark:text-white-100 text-black-900 text-sm font-medium px-3 border border-white-border dark:border-[#393E4F66] rounded-lg py-3 md:px-5 bg-white-100 dark:bg-black-800">
                              <Image
                                src="/assets/icons/microphone.svg"
                                alt="upload"
                                width={11}
                                height={15}
                              />
                              <span className="subtitle-medium tracking-wide dark:bg-black-700 px-2 py-1 rounded-md bg-white-200 ">
                                Choose a file
                              </span>
                            </Button>
                          )}
                        </CldUploadWidget>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <RHFInput
                  className="!placeholder:white-400 p3-medium dark:!placeholder-white-400"
                  name="podcastTitle"
                  label="Audio title"
                  placeholder="Ex: Codetime | Episode 8"
                />
              </>
            )}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINY_SECRET}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      onBlur={field.onBlur}
                      value={field.value}
                      onEditorChange={(content) => field.onChange(content)}
                      init={{
                        skin: 'oxide-dark',
                        icons: 'thin',
                        toolbar_location: 'top',
                        content_css: 'dark',
                        content_style: `
                   body { font-family: Roboto, sans-serif; font-size: 14px; color: #808191;  ${
                     mode === 'dark'
                       ? 'background-color: #262935;'
                       : 'background-color: #ffff;'
                   } }
                   }} body::-webkit-scrollbar   
                      tox-editor-header { background-color: #f8f8f8; } {display: none; }pre, code { font-family: "Roboto Mono", monospace; background-color: transparent !important;  padding: 5px; } body::before { color: #808191 !important; } h2 {color: #ffff!important}
                   h2 {color: #ffff!important}
                  }
                   `,
                        menubar: false,
                        plugins: 'code codesample link preview image',
                        toolbar:
                          'customImageButton customPreview | H2 bold italic underline link strikethrough alignleft aligncenter alignright image ',

                        setup: function (editor) {
                          editor.ui.registry.addButton('customImageButton', {
                            text: 'Write',
                            icon: 'edit-block',
                            onAction: function () {},
                          });
                          editor.ui.registry.addButton('customPreview', {
                            text: 'Preview',
                            icon: 'preview',
                            onAction: handlePreview,
                          });
                        },
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <FormLabel>
                Add or change tags (up to 5) so readers know what your story is
                about
              </FormLabel>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <CreatableSelect
                    instanceId={field.name}
                    className="border rounded-md dark:border-black-700/50"
                    {...field}
                    onInputChange={(value) => setTitle(value)}
                    classNames={{
                      input: () =>
                        'md:!text-[16px] dark:!text-white-100 text-black-800',
                      control: () =>
                        '!border-none !shadow-none relative  dark:bg-black-800 dark:!border-[#393E4F66] md:px-3 h-auto min-h-[44px]',
                      indicatorSeparator: () => '!hidden',
                      dropdownIndicator: () => '!hidden',
                      indicatorsContainer: () => 'absolute right-0 top-[-5px]',

                      multiValue: () =>
                        '!bg-white-200 !px-2 !py-1 dark:!bg-black-700 !text-white-100 !rounded-full',
                      multiValueLabel: () =>
                        '!uppercase dark:!text-white-200 !cap-10',
                      multiValueRemove: () =>
                        '!bg-white-200 !text-white-400 !ml-1  !rounded-3xl',
                      option: () =>
                        '!bg-white-100  !py-[18px]  dark:!bg-black-800  dark:!text-white-100 !text-black-800',
                      singleValue: () => 'dark:!text-white-100',
                      menu: () => 'bg-white-100 dark:bg-black-800 !shadow-sm ',
                    }}
                    isMulti
                    isOptionDisabled={() => field.value.length >= 5}
                    options={selectTagsOptions
                      ?.filter(
                        (item) =>
                          !field.value?.find((tag) => tag.label === item.label)
                      )
                      .map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))}
                    formatOptionLabel={(option, { context }) => {
                      if (context === 'value') {
                        return <div className="p4-medium">{option.label}</div>;
                      }
                      return (
                        <div className="flex items-center">
                          <Image
                            src="/assets/icons/archive.svg"
                            alt="frame"
                            width={16}
                            height={16}
                            className="dark:invert "
                          />
                          <div className="flex flex-col ml-2">
                            <p className="p4-medium uppercase">
                              {option.label}
                            </p>
                          </div>
                        </div>
                      );
                    }}
                  />
                )}
              />
            </div>
            {form.formState.errors.tags?.[0]?.label?.message && (
              <p className="text-[14px] text-red-500 dark:text-red-500">
                {form.formState.errors.tags[0].label.message}
              </p>
            )}

            <div className="flex gap-5 p3-bold">
              <Button
                onClick={resetForm}
                type="button"
                className="bg-light100__dark800 hover:!text-white-100 duration-200 hover:bg-primary-500 py-3 w-3/5">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => onSubmit()}
                className="bg-light100__dark800 hover:!text-white-100 duration-200 hover:bg-primary-500 py-3 w-3/5">
                {isLoading
                  ? editPost
                    ? 'Updating Post...'
                    : 'Publishing Post...'
                  : editPost
                    ? 'Update Post'
                    : 'Publish Post'}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Preview
          type={watchPostType}
          data={form.getValues()}
          setIsPreview={setIsPreview}
        />
      )}
    </div>
  );
};

export default CreatePosts;

const Option = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center">
        <Image
          src={props.data.profileImage || '/assets/icons/bootstrap.svg'}
          alt="frame"
          width={34}
          height={34}
        />
        <div className="flex flex-col ml-2">
          <p className="p4-medium">{props.data.label}</p>
          <p className="text-[11px] text-white-400">
            {props.data.bio || 'No bio available'}
          </p>
        </div>
      </div>
    </components.Option>
  );
};

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, onValueChange, value, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        value={value}
        onSelect={() => onValueChange && onValueChange(value)}
        className={cn(
          'text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
          className
        )}
        {...props}
        ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center"></Select.ItemIndicator>
      </Select.Item>
    );
  }
);
