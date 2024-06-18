import { EContentType, IContent } from './content';

export enum EGroupContentTyps {
  POST = 'post',
  MEETUP = 'meetup',
  PODCAST = 'podcast',
  MEMBERS = 'members',
}

export interface IGroup {
  id: string;
  name: string;
  type: EContentType;
  coverImage: string;
  profileImage: string;
  authorId: string;
  bio: string;
  createdAt: string | null;
  updatedAt: string | null;
  _count: {
    members?: number;
    contents?: number;
  };
  members: {
    id: string;
    avatarImg?: string;
  }[];
}

export interface IAllGroupsResponse {
  groups: IGroup[];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IAllGroupsSidebarDetails {
  topRankedGroups: IGroup[];
  topActiveGroups: IGroup[];
  meetups: IContent[];
  podcasts: IContent[];
  posts: IContent[];
}

export interface ISelectGroup {
  id: string;
  profileImage: string;
  bio: string;
  name: string;
  coverImg: string;
  updatedAt: Date;
  _count: {
    members: number;
  };
  members: {
    id: string;
    avatarImg?: string | undefined;
  };
}

export interface ITags {
  id: string;
  title: string;
}
