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
    return <div>Loading...</div>;
  }

  if (!user) {
    return <GuestLayout>{children}</GuestLayout>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

export default Layout;
