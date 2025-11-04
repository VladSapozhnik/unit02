export const buildPaginationHelper = (
  totalCount: number,
  pageNumber: number,
  pageSize: number,
) => {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    pageNumber,
    pageSize,
    totalCount,
  };
};
