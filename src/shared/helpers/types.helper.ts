export type WithoutTimestampsAndId<T> = Omit<
  T,
  '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
