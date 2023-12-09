export const exclude = <T, Key extends keyof T>(
  obj: T,
  keys: Key[]
): Omit<T, Key> => {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
};

export const getPaginationData = (queryParams: {
  page?: string;
  perPage?: string;
}) => {
  const page = queryParams.page ? +queryParams.page : 1;
  const perPage = queryParams.perPage ? +queryParams.perPage : 10;

  const skip = perPage * (page - 1);

  return { page, perPage, skip };
};

export const getTotalPages = ({
  totalCount,
  perPage,
}: {
  totalCount: number;
  perPage: number;
}) => Math.ceil(totalCount / perPage);
