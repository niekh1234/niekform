import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  router.replace('/dashboard');
  return null;
};

export default Home;
