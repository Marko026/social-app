import { auth } from '@/app/api/auth/[...nextauth]/route';
import ContentDetails from '@/components/content/contentDetails/ContentDetails';
import LeftSideBar from '@/components/content/leftSideBar/LeftSideBar';
import RightSideBar from '@/components/content/rightSideBar/RightSideBar';
import { IComment } from '@/lib/validation';
import { IContent } from '@/types/content';
import { IProfileUser } from '@/types/user';
import { typedFetch } from '@/utils/api';
import { getFirstName } from '@/utils/format';

type ParamsProps = {
  params: {
    id: string;
  };
};

type UserProps = {
  isFollowing: boolean;
  user: IProfileUser;
};

const Content = async (props: ParamsProps) => {
  const { id } = props.params;
  const session = await auth();
  if (!session) throw new Error('User data not available!');

  if (!id) throw new Error('No id provided');

  const contentDetails = await typedFetch<IContent>({
    url: `/content/${id}`,
    cache: 'no-cache',
  });

  const getAuthorDetails = await typedFetch<UserProps>({
    url: `/user/${contentDetails.authorId}`,
  });

  let authorName = getAuthorDetails.user.userName;

  authorName = getFirstName(authorName);

  const commentAuthorId = session.user.id;

  const allComments = await typedFetch<IComment[]>({
    url: `/content/${id}/comment?viewerId=${commentAuthorId}`,
    cache: 'no-cache',
  });

  return (
    <div className="content-wrapper px-4 !bg-white-200 dark:!bg-black-900 min-h-screen">
      <div className="left-sidebar !hidden lg:!flex !p-0">
        <LeftSideBar content={contentDetails} authorName={authorName} />
      </div>
      <ContentDetails
        contentId={contentDetails}
        commentAuthorId={commentAuthorId}
        allComments={allComments}
        getAuthorDetails={getAuthorDetails}
        content={contentDetails}
      />
      <div className="left-sidebar  w-full lg:hidden !p-0">
        <LeftSideBar content={contentDetails} authorName={authorName} />
      </div>
      <RightSideBar
        getAuthorDetails={getAuthorDetails}
        contentDetails={contentDetails}
        commentAuthorId={commentAuthorId}
      />
    </div>
  );
};
export default Content;
