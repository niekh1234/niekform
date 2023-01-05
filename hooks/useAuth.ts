import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

type useUserProps = {
  redirectTo?: string;
  redirectIfFound?: boolean;
};

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null };
    })
    .catch(() => {
      return { user: null };
    });

export const useAuth = ({ redirectTo, redirectIfFound }: useUserProps = {}) => {
  const router = useRouter();

  if (isPublicRoute(router.pathname)) {
    return { user: null, error: null, isLoading: false, mutate: () => null };
  }

  const { data, error, isLoading, mutate } = useSWR('/api/auth/me', fetcher);
  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);

  return { user, error, isLoading, mutate };
};

const isPublicRoute = (path: string) => {
  const basePaths = ['/p'];

  return basePaths.some((basePath) => path.startsWith(basePath));
};
