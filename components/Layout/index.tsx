import Loading from 'components/App/Loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AuthenticatedLayout from './AuthenticatedLayout';
import GuestLayout from './GuestLayout';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <Loading></Loading>;
  }

  if (!data) {
    if (!whiteList.includes(router.pathname)) {
      router.push('/auth/signin');
      return <Loading></Loading>;
    }

    return <GuestLayout>{children}</GuestLayout>;
  }

  if (router.pathname === '/auth/signin') {
    router.push('/dashboard');
    return <Loading></Loading>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

const whiteList = ['/auth/signin', '/auth/signup', '/auth/error'];

export default Layout;
