export type AllFollowersScreenProps = Record<string, never>;

export interface Follower {
  userId?: number;
  id?: string;
  fullName?: string;
  name?: string;
  profilePic?: string | null;
  avatar?: string;
}

