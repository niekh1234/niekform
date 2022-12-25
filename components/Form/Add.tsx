import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import InputError from 'components/App/InputError';
import Modal from 'components/App/Modal';
import { doPostRequest } from 'lib/client/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type FormAddProps = {
  onAdd: () => void;
  forProject?: string;
};

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
});

const FormAdd = ({ onAdd }: FormAddProps) => {
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

    const res = await doPostRequest('/api/admin/form', {
      name: data.name,
    });

    setProcessing(() => false);

    if (res.error) {
      setError(() => res.error);
    } else {
      setShowModal(() => false);
      onAdd();
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(() => true)}
        type="button"
        className="inline-flex items-center"
      >
        <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
        New form
      </button>

      <Modal open={showModal} setOpen={setShowModal}>
        <div className="p-6">
          <h3 className="font-bold">Add new form</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <label className="text-sm text-gray-500">Name</label>
            <input type="text" {...register('name')} className="input-primary"></input>
            <InputError message={(errors.name?.message as string) || error || ''}></InputError>

            <label className="mt-4 text-sm text-gray-500">Description (optional)</label>
            <textarea {...register('description')} className="input-primary"></textarea>
            <InputError
              message={(errors.description?.message as string) || error || ''}
            ></InputError>

            <Button type="submit" processing={processing} className="mt-4">
              Save
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default FormAdd;
