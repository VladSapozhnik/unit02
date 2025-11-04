import { UserQueryInput } from '../routes/input/user-query.input';

export const buildUserFilter = (query: UserQueryInput) => {
  const filter: Record<string, any> = {};

  if (query.searchEmailTerm) {
    filter.email = { $regex: query.searchEmailTerm, $options: 'i' };
  }

  if (query.searchLoginTerm) {
    filter.login = { $regex: query.searchLoginTerm, $options: 'i' };
  }

  return filter;
};
