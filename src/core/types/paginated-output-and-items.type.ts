import { PaginatedMetaType } from './paginated-meta.type';

export type PaginatedOutputAndItemsType<T> = PaginatedMetaType & {
  items: T[];
};
