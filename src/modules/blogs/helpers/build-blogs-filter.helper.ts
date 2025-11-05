import { BlogQueryInput } from '../routes/input/blog-query.input';

export const buildBlogsFilter = (query: BlogQueryInput) => {
  const filter: Record<string, any> = {};

  if (query.searchNameTerm) {
    filter.name = { $regex: query.searchNameTerm, $options: 'i' };
  }

  return filter;
};
