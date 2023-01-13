import { useAuth } from 'hooks/useAuth';
import { useRouter } from 'next/router';

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/dashboard');
  }

  return null;
};

export default Home;
