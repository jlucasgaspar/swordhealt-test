export type WithoutTimestampsAndId<T> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
