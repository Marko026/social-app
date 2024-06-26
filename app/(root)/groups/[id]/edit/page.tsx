import { auth } from '@/app/api/auth/[...nextauth]/route';
import CreateGroup from '@/components/createGroup/CreateGroup';
import { IGroupUpdate } from '@/types/group';
import { typedFetch } from '@/utils/api';

type Props = {
  params: {
    id: string;
  };
};

const EditGroup = async ({ params }: Props) => {
  const session = await auth();
  if (!session) throw new Error('User data not available!');

  const authorId = session.user.id;
  const groupId = params.id;

  const editGroup = await typedFetch<IGroupUpdate>({
    url: `/groups/${groupId}`,
  });

  if (!editGroup) throw new Error('Group not available!');

  return (
    <div className="content-wrapper max-w-[900px]">
      <CreateGroup authorId={authorId} editGroup={editGroup} />
    </div>
  );
};

export default EditGroup;
