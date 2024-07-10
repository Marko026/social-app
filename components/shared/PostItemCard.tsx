'use client';

import BadgeItem from './BadgeItem';

import HeartIcon from '../icons/Heart';
import { Button } from '../ui/button';

import Image from 'next/image';
import Link from 'next/link';

import type { ITag } from '@/types/content';
import { calculateTimeAgo, formatNumberWithCommas } from '@/utils/format';

import { revalidateRoute } from '@/lib/actions/revalidate';
import parse from 'html-react-parser';

// ----------------------------------------------------------------

interface IPostItemCardProps {
  id: string;
  coverImage: string | null;
  title: string;
  description: string;
  tags: ITag[];
  createdAt: Date;
  author: string;
  viewsCount: number | null;
  likesCount: number | null;
  commentsCount: number | null;
  isLiked: boolean;
  handleLikeContent: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contentId: string
  ) => Promise<void>;
}

const PostItemCard: React.FC<IPostItemCardProps> = ({
  id,
  coverImage,
  title,
  description,
  tags,
  viewsCount,
  likesCount,
  commentsCount,
  createdAt,
  isLiked,
  handleLikeContent,
  author,
}) => {
  return (
    <li>
      <Link
        onClick={() => revalidateRoute('/content/' + id)}
        href={'/content/' + id}
        className="bg-light100__dark800 flex gap-4 rounded-2xl p-4 md:items-center md:p-5 shadow-card">
        <Image
          src={coverImage || '/assets/icons/image-preview.svg'}
          width={165}
          height={165}
          alt={title}
          className=" max-md:hidden  rounded-2xl"
        />
        {/* RIGHT PART OF THE POST */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="mb-4 flex justify-between gap-2">
            <div className="flex gap-2">
              <Image
                src={coverImage || '/assets/icons/image-preview.svg'}
                width={50}
                height={50}
                alt={title}
                className="md:hidden"
              />
              <div>
                <p className="p1-bold mb-2">{title}</p>
                <div className="p3-regular line-clamp-1">
                  {parse(description)}
                </div>
              </div>
            </div>
            <Button
              type="button"
              className="flex-center bg-white-200 dark:bg-black-700 size-[30px] shrink-0 rounded-full"
              onClick={(e) => handleLikeContent(e, id)}>
              <HeartIcon
                className={isLiked ? 'text-primary-500' : 'text-white-300'}
              />
            </Button>
          </div>
          {tags?.length > 0 ? (
            <ul className="flex gap-2.5 flex-wrap">
              {tags.map(({ id, title }) => (
                <BadgeItem key={id} title={title} />
              ))}
            </ul>
          ) : null}
          <div className="flex-between flex-wrap gap-5">
            <div className="flex">
              <div className="flex-center mr-2.5 size-[40px] rounded-full bg-white-600">
                <Image
                  src="/assets/images/avatars/avatar-1.svg"
                  width={28}
                  height={34}
                  alt="avatar"
                />
              </div>
              <div>
                <p className="p3-bold">{author}</p>
                <p className="subtitle-normal">{calculateTimeAgo(createdAt)}</p>
              </div>
            </div>
            <div className="text-white-400 dark:text-white-300 flex gap-[30px]">
              <span className="p3-regular">
                {formatNumberWithCommas(viewsCount)} Views
              </span>
              <span className="p3-regular">
                {formatNumberWithCommas(likesCount)} Likes
              </span>
              <span className="p3-regular">
                {formatNumberWithCommas(commentsCount)} comments
              </span>
            </div>
          </div>
        </div>
        {/* RIGHT PART OF THE POST */}
      </Link>
    </li>
  );
};

export default PostItemCard;
