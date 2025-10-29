import { PaginatedMetaType } from './paginated-meta.type';

export type PaginatedOutputType<T> = PaginatedMetaType & {
  items: T[];
};
