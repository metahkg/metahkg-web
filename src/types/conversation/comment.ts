export type comment = {
  /** comment id */
  id: number;
  /** comment user id */
  user: number;
  /** the comment (in stringified html) */
  comment: string;
  /** date string */
  createdAt: string;
  /** number of downvotes */
  D?: number;
  /** number of upvotes */
  U?: number;
};
