import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import ConfirmButton from 'components/App/ConfirmButton';
import { spawnFlash } from 'components/App/Flash';
import InputError from 'components/App/InputError';
import FormTabs from 'components/Form/Tabs';
import { doDeleteRequest, doPutRequest, fetcher } from 'lib/client/api';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
});

const FormSettings = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading, mutate } = useSWR('/api/admin/form/' + id, fetcher);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [processing, setProcessing] = useState(false);

  const onSubmit = async (formData: any) => {
    setProcessing(() => true);

    const res = await doPutRequest('/api/admin/form/' + id, {
      name: formData.name,
    });

    setProcessing(() => false);

    if (res.error && !res?.project) {
      spawnFlash(res.error, 'error');
    } else {
      mutate(res);
      spawnFlash('Form updated', 'success');
    }
  };

  const deleteForm = async () => {
    const res = await doDeleteRequest('/api/admin/form/' + id);

    if (res.error) {
      spawnFlash(res.error, 'error');
    } else {
      router.push('/forms');
    }
  };

  // set initial form values
  useEffect(() => {
    if (data?.form) {
      reset({
        name: data.form.name,
      });
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <div className="p-4 mt-6 bg-white rounded-lg shadow md:p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="text-sm text-gray-500">Name</label>
          <input type="text" {...register('name')} className="input-primary"></input>
          <InputError message={(errors.name?.message as string) || ''}></InputError>

          <Button type="submit" processing={processing} className="mt-8">
            Save
          </Button>
        </form>
      </div>

      <div className="mt-12">
        <ConfirmButton onClick={() => deleteForm()}>
          <div className="flex items-center space-x-2 btn-outline">
            <ExclamationCircleIcon className="w-4 h-4"></ExclamationCircleIcon>
            <span>Delete form</span>
          </div>
        </ConfirmButton>
      </div>
    </section>
  );
};

export default FormSettings;
