import { TrashIcon } from '@heroicons/react/20/solid';
import ConfirmButton from 'components/App/ConfirmButton';
import EmptyState from 'components/App/EmptyState';
import { spawnFlash } from 'components/App/Flash';
import FieldAdd from 'components/Field/Add';
import FormTabs from 'components/Form/Tabs';
import { doDeleteRequest, fetcher } from 'lib/client/api';
import { Form } from 'lib/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const FormFields = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading, mutate } = useSWR('/api/admin/form/' + id, fetcher);

  const onAddField = () => {
    mutate();
    spawnFlash('Field added', 'success');
  };

  const deleteField = async (id: string) => {
    const res = await doDeleteRequest('/api/admin/field/' + id);

    if (res.error) {
      spawnFlash(res.error, 'error');
    } else {
      mutate();
      spawnFlash('Field deleted', 'success');
    }
  };

  if (isLoading) return <p>Loading...</p>;

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  return (
    <section className='max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold'>{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <div className='mt-6 overflow-hidden bg-white rounded-lg'>
        <div className='p-6'>
          <div className='flex justify-between'>
            <h3 className='font-bold'>Fields</h3>
            <FieldAdd formId={form.id} onAdd={() => onAddField()}></FieldAdd>
          </div>

          {form.fields.length === 0 ? (
            <EmptyState type='field' className='!shadow-none'>
              <Link href='https://github.com/niekh1234/niekform' className='btn-outline'>
                Need help?
              </Link>
            </EmptyState>
          ) : (
            <div className='mt-12 space-y-2'>
              {form.fields.map((field) => (
                <div
                  key={field.id}
                  className='flex justify-between p-4 text-gray-800 border rounded-xl group'
                >
                  <div className='w-1/3 font-bold'>{field.label}</div>
                  <div className='w-1/3 text-gray-500'>{field.type}</div>
                  <div className='w-1/3 text-sm'>{field.required ? 'Required' : ''}</div>
                  <div className='opacity-0 group-hover:opacity-100'>
                    <ConfirmButton onClick={() => deleteField(field.id)}>
                      <TrashIcon className='w-4 h-4 text-gray-500'></TrashIcon>
                    </ConfirmButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FormFields;
