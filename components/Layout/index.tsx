import Loading from 'components/App/Loading';
import { useAuth } from 'hooks/useAuth';
import AuthenticatedLayout from './AuthenticatedLayout';
import GuestLayout from './GuestLayout';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user, isLoading } = useAuth({
    redirectTo: '/login',
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (!user) {
    return <GuestLayout>{children}</GuestLayout>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

export default Layout;
