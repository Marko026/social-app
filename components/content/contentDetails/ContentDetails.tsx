'use client';
import ParseHtml from '@/components/ParseHtml/ParseHtml';
import AudioPlayer from '@/components/audioPlayer/AudioPlayer';
import Comments from '@/components/comments/Comments';
import { Button } from '@/components/ui/button';
import { IComment } from '@/lib/validation';
import { EContentType, IContent } from '@/types/content';
import { IProfileUser } from '@/types/user';
import {
  Content,
  DropdownMenu,
  Item,
  Portal,
  Trigger,
} from '@radix-ui/react-dropdown-menu';
import { EditIcon } from 'lucide-react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

type TagProps = {
  id: string;
  title: string;
};

type ContentDetailsProps = {
  content: IContent;
  commentAuthorId: string;
  contentId: IContent;
  allComments: IComment[];
  getAuthorDetails: {
    isFollowing: boolean;
    user: IProfileUser;
  };
};

const ContentDetails = ({
  content,
  contentId,
  commentAuthorId,
  getAuthorDetails,
  allComments,
}: ContentDetailsProps) => {
  const router = useRouter();

  return (
    <div className="main-content p1-bold w-full mx-auto md:mx-0  space-y-5">
      {content?.type === EContentType.PODCAST && (
        <AudioPlayer
          audioSrc={content.podcastFile!}
          title={content.title}
          audioTitle={content.podcastTitle!}
          coverImage={content.coverImage!}
        />
      )}
      {content?.type !== EContentType.PODCAST && (
        <Image
          src={content?.coverImage || ` /assets/images/meetup-example.svg`}
          width={100}
          height={100}
          layout="responsive"
          alt="post example"
          className="rounded-2xl w-full min-h-[232px] max-h-[300px] object-cover"
        />
      )}
      <div className="flex items-center justify-between">
        {content?.type === EContentType.MEETUP && (
          <>
            <div className="flex gap-2 max-w-3xl">
              <Image
                src={
                  getAuthorDetails.user?.avatarImg ||
                  '/assets/images/post-example.svg'
                }
                alt="avatar"
                width={72}
                height={72}
                className="rounded-md"
              />
              <h2 className="d2-bold !text-[16px] sm:!text-[20px] lg:!text-[24px] !leading-6 lg:leading-7">
                {content?.title || 'Title'}
              </h2>
            </div>
          </>
        )}

        {content?.type !== EContentType.MEETUP && (
          <h2 className="d2-bold text-wrap break-words overflow-wrap break-word overflow-hidden">
            {content?.title || 'Title'}
          </h2>
        )}
        {content?.authorId === commentAuthorId && (
          <DropdownMenu>
            <Trigger asChild>
              <Button className="w-auto">
                <Image
                  src="/assets/icons/menu-vertical.svg"
                  alt="Menu"
                  width={20}
                  height={20}
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
                className="bg-light100__dark800 px-2 !w-48 shadow-header-menu data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-20 mb-4 flex  flex-col gap-2.5 rounded-[10px] py-4 ">
                <Item
                  onSelect={() => router.push(`/content/${content?.id}/edit`)}
                  className="flex items-center gap-2.5 focus-visible:outline-none p3-medium cursor-pointer px-3 py-1 rounded-md hover:bg-white-300/30">
                  <EditIcon />
                  <p>Edit Post</p>
                </Item>
                <Item
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center focus-visible:outline-none  gap-2.5 p3-medium px-3 py-1.5 !text-[#FF584D] hover:bg-white-300/30 rounded-md cursor-pointer">
                  <Image
                    src="/assets/icons/trash.svg"
                    width={20}
                    height={18}
                    alt="Delete"
                  />
                  Delete Post
                </Item>
              </Content>
            </Portal>
          </DropdownMenu>
        )}
      </div>
      <div>
        <ul className="flex flex-wrap gap-2">
          {content?.tags.map((tag: TagProps) => (
            <li
              key={tag.id}
              className="dark:bg-black-700 bg-gray-100 rounded-full px-2 py-1 cap-10 uppercase">
              {tag.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="break-words">
        <ParseHtml data={content?.description} />
      </div>

      {content?.type === EContentType.MEETUP && (
        <>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar-primary.svg"
              alt="Preview"
              width={20}
              height={20}
            />
            <p className="p3-medium">
              {content?.meetupDate &&
                new Date(content.meetupDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                })}
            </p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/location-primary.svg"
              alt="Preview"
              width={20}
              height={20}
            />
            <p className="p3-medium">{content?.meetupLocation}</p>
          </div>
        </>
      )}
      <Comments
        contentId={contentId.id}
        commentAuthorId={commentAuthorId}
        allComments={allComments}
      />
    </div>
  );
};

export default ContentDetails;
