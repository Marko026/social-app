import { EContentType } from '@/types/content';
import * as z from 'zod';
export const signInSchema = z.object({
  userName: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const onboardingSchema = z.object({
  currentKnowledge: z.string().min(1),
  codingAmbitions: z.array(z.string()).min(1),
  preferredSkills: z.array(z.string().max(17)).min(1),
});

export const profileSchema = z.object({
  userId: z.string(),
  userName: z.string().optional(),
  name: z.string().optional().optional(),
  email: z
    .string({ required_error: 'Email is required!' })
    .trim()
    .email('Please provide valid email address!')
    .optional(),
  preferredSkills: z.array(z.string()).optional(),
  contents: z.array(z.string()).optional(),
  likedContents: z.array(z.string()).optional(),
  bio: z.string().optional(),
  avatarImg: z.string().optional(),
  createdAt: z.date().optional(),
  instagramName: z.string().optional(),
  instagramLink: z.string().optional(),
  linkedinName: z.string().optional(),
  linkedinLink: z.string().optional(),
  twitterName: z.string().optional(),
  twitterLink: z.string().optional(),
  followers: z.number().optional(),
  following: z.number().optional(),
});

export const postSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  title: z.string().min(3).max(100),
  type: z.nativeEnum(EContentType),
  groupId: z.object({
    value: z.string().min(1),
    label: z.string().min(1),
  }),
  coverImage: z.string().optional(),
  description: z.string().min(30),
  tags: z
    .array(
      z.object({
        label: z.string().min(1).max(20, ' Tag must be max 20 characters long'),
        value: z.string().min(1),
      })
    )
    .max(5),
  group: z.object({
    id: z.string(),
    bio: z.string(),
    name: z.string(),
    coverImage: z.string(),
  }),
});

export type IPost = z.infer<typeof postSchema>;

export type IMeetup = z.infer<typeof meetupSchema>;

export const meetupSchema = postSchema.extend({
  meetupLocation: z.string().min(3),
  meetupDate: z.coerce.date(),
});

export type IPodcast = z.infer<typeof podcastSchema>;

export const podcastSchema = postSchema.extend({
  podcastFile: z.string().min(3),
  podcastTitle: z.string().min(3),
});

export const updateContentDTO = postSchema.omit({
  authorId: true,
  type: true,
  groupId: true,
});

export const updateMeetupDTO = updateContentDTO.merge(meetupSchema);
export const updatePodcastDTO = updateContentDTO.merge(podcastSchema);

export type IUpdateContentDTO = z.infer<typeof updateContentDTO>;

const preferredSkillsSchema = z.object({
  value: z.string().trim().min(1, 'Tag must be at least 2 characters long!'),
  label: z.string().trim().min(1, 'Tag must be at least 2 characters long!'),
});

export const updateProfileSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(2, 'User name must be at least 2 character long'),
  name: z
    .string()
    .trim()
    .min(2, 'User name must be at least 2 character long')
    .optional(),
  preferredSkills: z
    .array(preferredSkillsSchema)
    .min(1, 'Please add at least one skill to your profile.'),
  bio: z.string().optional(),
  avatarImg: z.string().optional(),
  instagramName: z.string().optional(),
  instagramLink: z.string().url().optional().or(z.literal('')),
  linkedinName: z.string().optional(),
  linkedinLink: z.string().url().optional().or(z.literal('')),
  twitterName: z.string().optional(),
  twitterLink: z.string().url().optional().or(z.literal('')),
});

export const createGroupSchema = z.object({
  authorId: z.string(),
  name: z.string().min(1).max(50, 'Group name must be max 50 characters long'),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  bio: z.string().min(1).max(1000, 'Bio must be max 1000 characters long'),
  admins: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .max(5),
  members: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .max(5),
});

export const updateGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50, 'Group name must be max 50 characters long'),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  bio: z.string().min(1).max(1000, 'Bio must be max 1000 characters long'),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type IContent = IPost & IMeetup & IPodcast;
export type IContentDTO = Omit<IContent, 'tags' | 'groupId'> & {
  groupId: string;
  tags: {
    id: string;
    title: string;
  }[];
};

export type IPutPostDTO = Omit<IPost, 'tags' | 'groupId' | 'group' | 'id'> & {
  groupId: string;
  tags: string[];
};
export type IPutMeetupDTO = Omit<
  IMeetup,
  'tags' | 'groupId' | 'group' | 'id'
> & {
  groupId: string;
  tags: string[];
};
export type IPutPodcastDTO = Omit<
  IPodcast,
  'tags' | 'groupId' | 'group' | 'id'
> & {
  groupId: string;
  tags: string[];
};

export const commentFormSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(2).max(1000),
  editMessage: z.string().optional(),
  authorId: z.string(),
  contentId: z.string(),

  replyingTo: z
    .object({
      text: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      author: z.object({
        userName: z.string(),
        avatarImg: z.string(),
      }),
    })
    .optional(),
});

export const baseCommentSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.date(),
  authorId: z.string(),
  userName: z.string(),
  contentId: z.string(),
  updatedAt: z.date(),
  author: z.object({
    userName: z.string(),
    avatarImg: z.string(),
  }),
  viewerHasLiked: z.boolean().optional(),
  replies: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        authorId: z.string(),
        author: z.object({
          userName: z.string(),
          avatarImg: z.string(),
        }),
      })
    )
    .optional(),
});

export const editAndReplyCommentSchema = z.object({
  text: z.string().min(2).max(1000),
});

export const editDeleteReplyCommentSchema = z.object({
  id: z.string(),
  text: z.string().min(2).max(1000),
});

export type IComment = z.infer<typeof baseCommentSchema>;
