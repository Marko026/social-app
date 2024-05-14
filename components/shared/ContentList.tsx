import { EQueryContentType, IContent } from '@/types/content';
import PostItemCard from './PostItemCard';
import MeetupItemCard from './MeetupItemCard';
import PodcastItemCard from './PodcastItemCard';
import GroupItemCard from './GroupItemCard';

// ----------------------------------------------------------------

interface IContentListProps {
  contentType: EQueryContentType;
  items: IContent[];
}

const ContentList: React.FC<IContentListProps> = ({ contentType, items }) => {
  console.log('items', items);

  switch (contentType) {
    case EQueryContentType.POSTS: {
      return (
        <ul className="flex flex-col flax-wrap gap-5">
          {items.map(
            ({
              id,
              title = '',
              coverImage = '',
              contentDescription = '',
              storyTags,
              viewsCount,
              likesCount,
              commentsCount,
            }) => (
              <PostItemCard
                key={id}
                coverImage={coverImage}
                title={title}
                description={contentDescription}
                tags={storyTags}
                viewsCount={viewsCount}
                likesCount={likesCount}
                commentsCount={commentsCount}
              />
            )
          )}
        </ul>
      );
    }
    case EQueryContentType.MEETUPS: {
      return (
        <ul className="flex flex-col flax-wrap gap-5">
          {items.map(
            ({
              id,
              meetUpDate,
              title = '',
              contentDescription = '',
              coverImage,
              storyTags,
            }) => (
              <MeetupItemCard
                key={id}
                coverImage={coverImage}
                title={title}
                description={contentDescription}
                tags={storyTags}
                location="Innovation Hub, Austin"
                date={meetUpDate}
              />
            )
          )}
        </ul>
      );
    }
    case EQueryContentType.PODCASTS: {
      return (
        <ul className="flex flex-col flax-wrap gap-5">
          {items.map(
            ({
              id,
              coverImage,
              title = '',
              contentDescription = '',
              storyTags,
              createdAt,
            }) => (
              <PodcastItemCard
                key={id}
                coverImage={coverImage}
                title={title}
                description={contentDescription}
                tags={storyTags}
                author="Pavel Gvay"
                createdAt={createdAt}
              />
            )
          )}
        </ul>
      );
    }
    case EQueryContentType.GROUPS: {
      return (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GroupItemCard
            title="CodeCrafters Hub"
            imgUrl="/assets/images/group-example.svg"
            description="Connect with fellow developers, share insights, and embark on coding
            adventures. Join us in mastering the art of web dev through
            collaborative projects."
          />
          <GroupItemCard
            title="CodeCrafters Hub"
            imgUrl="/assets/images/group-example.svg"
            description="Connect with fellow developers, share insights, and embark on coding
            adventures. Join us in mastering the art of web dev through
            collaborative projects."
          />
        </ul>
      );
    }
    default: {
      return <ul className="flex flex-col flax-wrap gap-5"></ul>;
    }
  }
};

export default ContentList;