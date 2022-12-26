import FormSubmissionsTable from 'components/Submission/Table';
import FormTabs from 'components/Form/Tabs';
import { fetcher } from 'lib/client/api';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const FormSubmissions = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading, mutate } = useSWR('/api/admin/form/' + id, fetcher);

  if (isLoading) return <p>Loading...</p>;

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  return (
    <section className='max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold'>{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <div className='mt-12 overflow-hidden bg-white rounded-lg'>
        <FormSubmissionsTable form={form}></FormSubmissionsTable>
      </div>
    </section>
  );
};

export default FormSubmissions;
