import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { fetcher } from 'lib/client/api';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

export const useFormSubmissions = (
  key: string = '0',
  formId: string,
  query: NextParsedUrlQuery
) => {
  const [hasFetched, setHasFetched] = useState(false);
  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR(key, () => fetcher('/api/admin/form/' + formId + '/submissions?' + buildQuery(query)));

  useEffect(() => {
    if (data && !hasFetched) {
      setHasFetched(true);
    }
  }, [data, hasFetched]);

  return {
    data,
    error: fetchError,
    isLoading,
    mutate,
    hasFetched,
  };
};

const buildQuery = (query: NextParsedUrlQuery) => {
  const params: any = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    params.append(key, value);
  }

  return params.toString();
};
