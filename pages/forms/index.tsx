import EmptyState from 'components/App/EmptyState';
import ProjectAdd from 'components/Project/Add';
import { fetcher } from 'lib/client/api';
import useSWR from 'swr';

const Forms = () => {
  const { data, error, isLoading } = useSWR('/api/admin/project', fetcher);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Failed to load, please try again later.</div>;

  if (data)
    return (
      <section className="mx-auto max-w-4xl">
        <EmptyState type="Project">
          <ProjectAdd></ProjectAdd>
        </EmptyState>
      </section>
    );

  return <section></section>;
};

export default Forms;
