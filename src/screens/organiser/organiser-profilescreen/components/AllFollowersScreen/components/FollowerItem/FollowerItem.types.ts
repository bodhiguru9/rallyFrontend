import type { Follower } from '../../AllFollowersScreen.types';

export interface FollowerItemProps {
  follower: Follower;
  onRemove: (userId: number) => void;
}

