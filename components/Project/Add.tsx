import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import InputError from 'components/App/InputError';
import Modal from 'components/App/Modal';
import { doPostRequest } from 'lib/client/api';
import Router from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
  title: yup.string().required(),
});

const ProjectAdd = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    setProcessing(() => true);

    const res = await doPostRequest('/api/auth/login', {
      username: data.email,
      password: data.password,
    });

    setProcessing(() => false);

    if (res.error) {
      setError(() => res.error);
    } else {
      Router.push('/dashboard');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(() => true)}
        type="button"
        className="inline-flex items-center btn-primary"
      >
        <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
        New project
      </button>

      <Modal open={showModal} setOpen={setShowModal}>
        <div className="p-6">
          <h3 className="font-bold">Add new project</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <label className="text-sm text-gray-500">Title</label>
            <input type="text" {...register('title')} className="input-primary"></input>
            <InputError message={(errors.title?.message as string) || error || ''}></InputError>

            <Button type="submit" processing={processing} className="mt-4">
              Save
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ProjectAdd;
