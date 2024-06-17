import { auth } from '@/app/api/auth/[...nextauth]/route';
import ProfileHome from '@/components/profile/ProfileHome';
import type { IContent } from '@/types/content';
import type { IGroup } from '@/types/group';
import { EQueryType } from '@/types/queries';
import type { IProfileUserResponse } from '@/types/user';
import { typedFetch } from '@/utils/api';
import { parseSearchParams } from '@/utils/query';

// ----------------------------------------------------------------

interface IMyProfilePageProps {
  searchParams: {
    page: string | string[] | undefined;
    type: string | string[] | undefined;
  };
}

const MyProfilePage: React.FC<IMyProfilePageProps> = async ({
  searchParams,
}) => {
  const page = parseSearchParams(searchParams.page, '1');
  const contentType = parseSearchParams<EQueryType>(
    searchParams.type,
    EQueryType.POST
  );

  const session = await auth();
  if (!session?.user) throw new Error('User data not available!');

  const userResult = await typedFetch<IProfileUserResponse>({
    url: `/user/${session?.user.id}`,
    cache: 'no-store',
  });

  if (!userResult.user) throw new Error('User data not available!');

  let content: IContent[] = [];
  let groupContent: IGroup[] = [];
  if (contentType === EQueryType.GROUP) {
    groupContent = await typedFetch<IGroup[]>({
      url: `/user/${session.user.id}/groups`,
    });
  } else {
    content = await typedFetch<IContent[]>({
      url: `/user/${session.user.id}/content?type=${contentType}&page=${page}&viewerId=${session.user.id}`,
    });
  }

  return (
    <section className="px-3.5 lg:px-5">
      <ProfileHome
        isPersonalProfile
        user={userResult.user}
        isFollowing={userResult.isFollowing}
        contentType={contentType}
        contentItems={content}
        groupItems={groupContent}
        viewerId={session.user.id}
      />
    </section>
  );
};

export default MyProfilePage;
