'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import RHFInput from '../RHFInputs/RHFInput';

import { revalidateRoute } from '@/lib/actions/revalidate';
import { IComment, commentFormSchema } from '@/lib/validation';
import { typedFetch } from '@/utils/api';
import { formatDate } from '@/utils/format';
import {
  Content,
  DropdownMenu,
  Item,
  Portal,
  Trigger,
} from '@radix-ui/react-dropdown-menu';
import { EditIcon } from 'lucide-react';
import { useState } from 'react';
import RCommentForm from '../RHFInputs/RCommentForm';
import RHRreplyForm from '../RHFInputs/RHRreplyForm';

type AllCommentProps = {
  allComments: IComment[];
  commentAuthorId: string;
  contentId: string;
};

const Comments = ({
  allComments,
  commentAuthorId,
  contentId,
}: AllCommentProps) => {
  const [editComment, setEditComment] = useState<string | null>(null);
  const [editReply, setEditReply] = useState<string | null>(null);
  const [replyingComment, setReplyingComment] = useState<string | null>(null);

  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      text: '',
      authorId: commentAuthorId,
      contentId,
    },
  });

  const onSubmit = async (values: z.infer<typeof commentFormSchema>) => {
    try {
      await typedFetch({
        url: '/content/comment',
        method: 'POST',
        body: {
          text: values.text,
          authorId: values.authorId,
          contentId: values.contentId,
        },
      });
      revalidateRoute('/content/comment');
      form.reset();
      setReplyingComment(null);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to post comment');
    }
  };

  const onDelete = async (commentId: string) => {
    try {
      await typedFetch({
        url: '/content/comment/delete',
        method: 'DELETE',
        body: {
          id: commentId,
        },
      });
      revalidateRoute('/comment');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete comment');
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await typedFetch({
        url: '/content/comment/like',
        method: 'POST',
        body: {
          id: commentId,
          userId: commentAuthorId,
        },
      });
      revalidateRoute('/content/comment');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to like comment');
    }
  };

  const deleteReply = async (replyId: string, commentId: string) => {
    try {
      await typedFetch({
        url: '/content/comment/reply/delete',
        method: 'DELETE',
        body: {
          id: replyId,
          commentId: commentId,
          contentId,
        },
      });
      revalidateRoute('/content/comment');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete reply comment');
    }
  };

  return (
    <div className="!mt-20 space-y-5 max-w-[825px]">
      <h2 className="h1-medium ">Comments</h2>
      <div className="flex items-center gap-3">
        <div className="bg-white-100 rounded-full p-1 px-2">
          <Image
            src="/assets/images/avatars/avatar-1.svg"
            width={32}
            height={30}
            alt="avatar"
            className="rounded-full ml-1"
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full">
            <RHFInput
              className="bg-white-200"
              name="text"
              onChange={(e) => form.setValue('text', e.target.value)}
              placeholder="Say something nice to Mansurl Haque..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
            />
          </form>
        </Form>
      </div>

      {allComments.map((comment) => (
        <div key={comment.id}>
          {editComment === comment.id ? (
            <RCommentForm
              comment={comment}
              isReplying={false}
              isEdit={true}
              setOpenEdit={() => setEditComment(null)}
              setOpenReply={() => setReplyingComment(null)}
            />
          ) : (
            <div key={comment.id}>
              <div className="bg-light200__dark800 space-y-4 p-3 md:p-6 rounded-lg shadow-lg">
                <div className="flex  justify-between items-start sm:items-center">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center h-full">
                        <Image
                          src={
                            comment.author.avatarImg ||
                            '/assets/images/avatars/avatar-1.svg'
                          }
                          width={28}
                          height={28}
                          alt="avatar"
                          className="rounded-full h-full object-cover"
                        />
                      </div>

                      <div className="flex items-start flex-col md:flex-row md:items-center h-6 ml-1 sm:ml-0 md:gap-2">
                        <h4 className="p3-bold tracking-wide !text-[12px] sm:!text-[14px] !font-semibold md:font-bold md:mb-2">
                          {comment.author.userName}
                        </h4>
                        <div className="text-[8px] sm:text-[10px] lg:text-[12px]">
                          <span className="relative bottom-1 text-white-400">
                            {formatDate(comment.createdAt)}
                          </span>
                          <span className="size-1 relative bottom-1 rounded-full bg-white-400"></span>
                          <span className="relative bottom-1 text-white-400">
                            {formatDate(comment.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4  sm:mt-0">
                    <div
                      className="flex gap-1 items-center cursor-pointer"
                      onClick={() => setReplyingComment(comment.id)}>
                      <Image
                        src="/assets/icons/reply.svg"
                        width={16}
                        height={16}
                        alt="avatar"
                        className="rounded-full invert"
                      />
                      <p className="text-[10px] text-white-400">Reply</p>
                    </div>
                    <Image
                      onClick={() => handleLike(comment.id)}
                      src={
                        comment?.viewerHasLiked
                          ? '/assets/icons/like.svg'
                          : '/assets/icons/heart.svg'
                      }
                      width={16}
                      height={16}
                      alt="avatar"
                      className="w-[16px] h-[16px] cursor-pointer"
                    />
                    <DropdownMenu>
                      <Trigger asChild>
                        <Button className="w-auto">
                          <Image
                            src="/assets/icons/menu-vertical.svg"
                            alt="Menu"
                            width={16}
                            height={16}
                          />
                        </Button>
                      </Trigger>
                      <Portal>
                        <Content
                          avoidCollisions
                          collisionPadding={15}
                          sideOffset={8}
                          align="end"
                          onCloseAutoFocus={(e) => e.preventDefault()}
                          className="bg-black-900 border border-black-700/40 !w-48 px-5 shadow-header-menu data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-20 mb-4 flex flex-col gap-2.5 rounded-[10px] py-4">
                          <Item
                            onClick={() => setEditComment(comment.id)}
                            className="flex items-center gap-2.5 p2-medium cursor-pointer">
                            <EditIcon size={16} />
                            <p>Edit Comment</p>
                          </Item>
                          <Item
                            onClick={() => onDelete(comment.id)}
                            onSelect={(e) => e.preventDefault()}
                            className="flex items-center gap-2.5 p2-medium !text-[#FF584D] cursor-pointer">
                            <Image
                              src="/assets/icons/trash.svg"
                              width={16}
                              height={18}
                              alt="Delete"
                            />
                            Delete Comment
                          </Item>
                        </Content>
                      </Portal>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="p2-regular !text-[12px] md:!text-[14px] !ml-3 !mt-3 md:!mt-1 !text-white-400 !font-semibold">
                  {comment.text.charAt(0).toUpperCase() + comment.text.slice(1)}
                </p>
                {comment.replies && (
                  <div className="!w-full space-y-2 !mt-0 text-[11px] p-2 rounded-lg text-wrap break-words overflow-wrap break-word overflow-hidden">
                    {comment.replies.map((reply, idx) => (
                      <>
                        {editReply === reply.id ? (
                          <RHRreplyForm
                            comment={comment}
                            reply={reply}
                            isEdit={true}
                            setOpenEdit={() => setEditReply(null)}
                            setOpenReply={() => setReplyingComment(null)}
                          />
                        ) : (
                          <div key={idx + 1}>
                            <div className="flex items-center">
                              <div className="flex gap-1">
                                <Image
                                  src={
                                    reply.author.avatarImg ||
                                    '/assets/images/avatars/avatar-1.svg'
                                  }
                                  width={20}
                                  height={20}
                                  alt="avatar"
                                  className="rounded-full"
                                />
                                {reply.author.userName}

                                <p className="ml-1">
                                  {formatDate(reply.createdAt)}
                                </p>
                              </div>
                            </div>
                            <p className="ml-7 text-white-400 font-semibold">
                              {reply.text.charAt(0).toUpperCase() +
                                reply.text.slice(1)}
                            </p>
                            <div className="space-x-1">
                              <span
                                onClick={() => setEditReply(reply.id)}
                                className="text-white-500 px-2 py-0.5 bg-light100__dark800 hover:bg-white-300 cursor-pointer rounded-lg">
                                Edit
                              </span>
                              <span
                                onClick={() =>
                                  deleteReply(reply.id, comment.id)
                                }
                                className="text-white-500 px-2 py-0.5 bg-light100__dark800 hover:bg-white-300 cursor-pointer rounded-lg">
                                Delete
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {replyingComment === comment.id && (
            <RCommentForm
              comment={comment}
              isReplying={true}
              isEdit={false}
              setOpenEdit={() => setEditComment(null)}
              setOpenReply={() => setReplyingComment(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
