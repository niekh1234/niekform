import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Home = () => {
  const session = useSession();
  const router = useRouter();

  if (session?.data?.user) {
    router.push('/dashboard');
  }

  return null;
};

export default Home;
