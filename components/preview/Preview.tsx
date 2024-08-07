'use client';

import { EContentType } from '@/types/content';
import Image from 'next/image';
import ParseHtml from '../ParseHtml/ParseHtml';
import AudioPlayer from '../audioPlayer/AudioPlayer';

type PreviewProps = {
  setIsPreview: (value: boolean) => void;
  type: string;
  data: any;
};
type TagProps = {
  label: string;
};

const Preview = ({ setIsPreview, type, data }: PreviewProps) => {
  return (
    <section className="space-y-5 w-full px-2">
      <div className="flex gap-2" onClick={() => setIsPreview(false)}>
        <Image
          src="/assets/icons/arrow-left.svg"
          alt="Preview"
          width={20}
          height={20}
          className="dark:invert-0 invert"
        />
        <Image
          src="/assets/icons/view.svg"
          alt="Preview"
          width={20}
          height={20}
        />
        <h1 className="!text-primary-500 font-semibold">Preview</h1>
      </div>
      {type === EContentType.PODCAST && (
        <AudioPlayer
          audioSrc={data?.podcastFile || ''}
          coverImage={data?.coverImage || ''}
          title={data?.title || ''}
          audioTitle={data?.podcastTitle || ''}
        />
      )}
      {type !== EContentType.PODCAST && (
        <Image
          src={data?.coverImage || '/assets/images/post-example.svg'}
          alt="Preview"
          width={785}
          height={270}
          className="rounded-lg h-72 object-cover w-full"
        />
      )}
      <div className="flex gap-2 max-w-3xl">
        {type === EContentType.MEETUP && (
          <Image
            src={data?.profileImage || '/assets/images/post-example.svg'}
            alt="avatar"
            width={72}
            height={72}
            className="rounded-md"
          />
        )}
        <h2 className="d2-bold">{data?.title || 'Title'}</h2>
      </div>
      <div>
        <ul className="flex gap-2">
          {data?.tags?.map((tag: TagProps) => (
            <li
              key={tag.label}
              className="dark:bg-black-700 bg-gray-100 rounded-full px-2 py-1 cap-10 uppercase">
              {tag.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="break-words">
        <ParseHtml data={data?.description} />
      </div>

      {type === EContentType.MEETUP && (
        <>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar-primary.svg"
              alt="Preview"
              width={20}
              height={20}
            />
            <p className="p3-medium">
              {new Date(data?.meetupDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
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
            <p className="p3-medium">{data?.meetupLocation}</p>
          </div>
        </>
      )}
    </section>
  );
};

export default Preview;
