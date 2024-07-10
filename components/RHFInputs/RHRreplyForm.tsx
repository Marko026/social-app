import { Form } from '@/components/ui/form';
import { revalidateRoute } from '@/lib/actions/revalidate';
import { editDeleteReplyCommentSchema, IComment } from '@/lib/validation';
import { typedFetch } from '@/utils/api';
import { formatDate } from '@/utils/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import RHFInput from './RHFInput';

type CommentProps = {
  comment: IComment;
  isEdit: boolean;
  reply: {
    id: string;
    text: string;
  };
  setOpenEdit: (value: boolean) => void;
  setOpenReply: (value: boolean) => void;
};

const RHRreplyForm = ({
  comment,
  isEdit,
  setOpenEdit,
  setOpenReply,
  reply,
}: CommentProps) => {
  const session = useSession();
  const form = useForm<z.infer<typeof editDeleteReplyCommentSchema>>({
    resolver: zodResolver(editDeleteReplyCommentSchema),
    defaultValues: {
      id: reply.id ?? '',
      text: isEdit ? reply.text : '',
    },
  });

  const onSubmit = async (
    values: z.infer<typeof editDeleteReplyCommentSchema>
  ) => {
    if (isEdit) {
      try {
        await typedFetch({
          url: `/content/comment/update`,
          method: 'PATCH',
          body: {
            id: comment.id,
            replyId: reply.id,
            text: comment.text,
            textReply: values.text,
            contentId: comment.contentId,
            authorId: comment.authorId,
          },
        });

        setOpenEdit(false);
        revalidateRoute(`/content/comment/${comment.id}`);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to edit comment');
      }
    } else {
      try {
        await typedFetch({
          url: '/content/comment',
          method: 'POST',
          body: {
            text: values.text,
            authorId: session?.data?.user.id,
            contentId: comment.contentId,
            replyingToId: comment.id,
          },
        });

        setOpenReply(false);
        revalidateRoute('/content/comment');
      } catch (error) {
        console.error(error);
        throw new Error('Failed to reply to comment');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <div className="bg-light100__dark800 space-y-4 !w-full p-3 md:p-6 rounded-lg shadow-2xl mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/avatars/avatar-1.svg"
                width={28}
                height={28}
                alt="avatar"
                className="rounded-full"
              />
              <div className="flex gap-1">
                <h4 className="p3-bold  tracking-wide !text-[12px] !mb-0  lg:!text-[12px] !font-semibold md:font-bold md:mb-2">
                  {session?.data?.user.name}
                </h4>
                <span className=" text-white-400 text-[10px] md:text-[12px] ">
                  {formatDate(comment.createdAt)}
                </span>
                <span className=" text-white-400 text-[10px] md:text-[12px] ">
                  {formatDate(comment.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-col space-y-4 !mt-5 md:mt-0">
            <RHFInput
              name="text"
              onChange={(e) => form.setValue('text', e.target.value)}
              className="bg-white-200 dark:bg-black-900 md:h-20 "
            />
            <div className=" w-1/2 ml-auto flex  justify-end">
              <Button
                onClick={() => {
                  if (isEdit) {
                    setOpenEdit(false);
                  } else {
                    setOpenReply(false);
                  }
                }}
                type="button"
                className="!text-white-400 w-1/3 md:w-1/4 !text-[14px] capitalize cursor-pointer p3-medium">
                Cancel
              </Button>
              <span className="text-white-400 mx-1">|</span>
              <Button
                type="submit"
                className="!text-primary-500  w-1/3 md:w-1/4  !text-[14px]  capitalize cursor-pointer p3-medium">
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RHRreplyForm;
