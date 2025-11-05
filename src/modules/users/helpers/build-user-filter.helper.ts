import { UserQueryInput } from '../routes/input/user-query.input';

export const buildUserFilter = (query: UserQueryInput) => {
  const or: any[] = [];

  if (query.searchLoginTerm) {
    or.push({ login: { $regex: query.searchLoginTerm, $options: 'i' } });
  }
  if (query.searchEmailTerm)
    or.push({ email: { $regex: query.searchEmailTerm, $options: 'i' } });

  return or.length ? { $or: or } : {};
};
