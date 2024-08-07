'use client';

import Image from 'next/image';
import Link from 'next/link';
import BadgeItem from './BadgeItem';

import type { ITag } from '@/types/content';
import { parseDate } from '@/utils/format';
import parse from 'html-react-parser';

// ----------------------------------------------------------------

interface IMeetupItemCardProps {
  id: string;
  title: string;
  coverImage: string | null;
  location: string;
  meetupDate: Date | null;
  description: string;
  tags: ITag[];
}

const MeetupItemCard: React.FC<IMeetupItemCardProps> = ({
  id,
  coverImage,
  location,
  title,
  meetupDate,
  description,
  tags,
}) => {
  const shortenedDate = meetupDate ? parseDate(meetupDate) : 'TBD';
  const [month, day] = shortenedDate.split(' ');

  return (
    <li>
      <Link
        href={'/content/' + id}
        className="bg-light100__dark800 flex flex-col gap-2.5 rounded-[10px] px-3.5 py-5 shadow-card"
      >
        <div className="flex-between flex">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative size-[56px] shrink-0 md:size-[72px]">
              <Image
                src={coverImage || '/assets/icons/image-preview.svg'}
                alt="meetup"
                fill
              />
            </div>
            <div>
              <p className="lg:p1-bold p3-bold">{title}</p>
              <p className="lg:p3-regular subtitle-normal">{location}</p>
            </div>
          </div>
          <div className="flex-center bg-light200__dark700 h-[56px] w-[38px] shrink-0 flex-col rounded-[6px] px-2.5 py-[5px] md:h-[58px] md:w-[54px]">
            <span className="subtitle-normal md:p4-regular text-black-800 dark:text-white-200 uppercase">
              {month}
            </span>
            <span className="p2-bold md:d2-bold !text-primary-500">{day}</span>
          </div>
        </div>
        <div className="p4-regular md:p3-regular line-clamp-2">
          {parse(description)}
        </div>
        {tags?.length > 0 ? (
          <ul className="flex gap-2.5 flex-wrap">
            {tags.map(({ id, title }) => (
              <BadgeItem key={id} title={title} />
            ))}
          </ul>
        ) : null}
      </Link>
    </li>
  );
};

export default MeetupItemCard;
