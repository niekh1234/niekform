import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import InputError from 'components/App/InputError';
import { doPutRequest, fetcher } from 'lib/client/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { spawnFlash } from 'components/App/Flash';

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
  description: yup.string().default(''),
});

const ProjectID = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading } = useSWR('/api/admin/project/' + id, fetcher);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [processing, setProcessing] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const onSubmit = async (data: any) => {
    setProcessing(() => true);

    const res = await doPutRequest('/api/admin/project', {
      name: data.name,
      descriptiion: data.description,
    });

    setProcessing(() => false);

    if (res.error) {
      setUpdateError(() => res.error);
    } else {
    }
  };

  return (
    <section className="p-4 bg-white shadow md:p-6 ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="text-sm text-gray-500">Name</label>
        <input type="text" {...register('name')} className="input-primary"></input>
        <InputError message={(errors.name?.message as string) || ''}></InputError>

        <label className="mt-4 text-sm text-gray-500">Description (optional)</label>
        <textarea {...register('description')} className="input-primary"></textarea>
        <InputError message={(errors.description?.message as string) || ''}></InputError>

        <Button type="submit" processing={processing} className="mt-4">
          Save
        </Button>
      </form>

      <button onClick={() => spawnFlash('test message mate', 'success')}>Test flash</button>
    </section>
  );
};

export default ProjectID;
