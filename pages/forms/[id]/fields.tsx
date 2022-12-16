import FieldAdd from 'components/Field/Add';
import FormTabs from 'components/Form/Tabs';
import { fetcher } from 'lib/client/api';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const FormFields = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading, mutate } = useSWR('/api/admin/form/' + id, fetcher);

  if (isLoading) return <p>Loading...</p>;

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <div className="mt-6 overflow-hidden bg-white rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Add fields</h3>
            <FieldAdd formId={form.id} onAdd={() => null}></FieldAdd>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormFields;
