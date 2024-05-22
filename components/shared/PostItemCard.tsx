'use client';

import BadgeItem from './BadgeItem';

import HeartIcon from '../icons/Heart';
import { Button } from '../ui/button';

import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import Image from 'next/image';

import { formatNumberWithCommas } from '@/utils/format';
import { calculateTimeAgo } from '@/utils/format';

// ----------------------------------------------------------------

interface IPostItemCardProps {
  id: string;
  coverImage?: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  author: string;
  viewsCount?: number | null;
  likesCount?: number | null;
  commentsCount?: number | null;
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
}) => {
  return (
    <li>
      <Link
        href={'/posts/' + id}
        className="bg-light100__dark800 flex gap-4 rounded-2xl p-4 md:items-center md:p-5"
      >
        <CldImage
          src={coverImage || '/assets/images/no-image.svg'}
          width={165}
          height={165}
          alt={title}
          className="shrink-0 self-baseline max-md:hidden"
        />
        {/* RIGHT PART OF THE POST */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="mb-4 flex justify-between gap-2">
            <div className="flex gap-2">
              <CldImage
                src={coverImage || '/assets/images/no-image.svg'}
                width={50}
                height={50}
                alt={title}
                className="shrink-0 self-baseline md:hidden"
              />
              <div>
                <p className="p1-bold mb-2">{title}</p>
                <p className="p3-regular line-clamp-1">{description}</p>
              </div>
            </div>
            <Button
              className="flex-center size-[30px] shrink-0 rounded-full bg-white-200 dark:bg-black-700"
              onClick={() => alert('radi btn')}
            >
              <HeartIcon className="text-white-300" />
            </Button>
          </div>
          {tags.length > 0 ? (
            <ul className="flex gap-2.5">
              {tags.map((tag) => (
                <BadgeItem key={tag} title={tag} />
              ))}
            </ul>
          ) : null}
          <div className="flex-between flex-wrap gap-5">
            <div className="flex">
              <div className="flex-center mr-2.5 size-[40px] rounded-full bg-[#F0F1FE]">
                <Image
                  src="/assets/images/avatars/avatar-1.svg"
                  width={28}
                  height={34}
                  alt="avatar"
                />
              </div>
              <div>
                <p className="p3-bold">Pavel Gvay</p>
                <p className="subtitle-normal">{calculateTimeAgo(createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-[30px] text-white-400 dark:text-white-300">
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
