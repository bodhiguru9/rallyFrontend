export type TagSearchType = 'sport' | 'eventType';

export interface TagSearchParams {
  searchType: TagSearchType;
  value: string;
}
