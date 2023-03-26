import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import InputError from 'components/App/InputError';
import Modal from 'components/App/Modal';
import { doPostRequest } from 'lib/client/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type InviteAddProps = {
  project: string;
  onAdd: () => void;
};

const schema = yup.object({
  email: yup.string().email().required('Please enter an email address'),
});

const InviteAdd = ({ project, onAdd }: InviteAddProps) => {
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

    const res = await doPostRequest(`/api/admin/project/${project}/invite`, {
      email: data.email,
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
        className="inline-flex items-center btn-primary"
      >
        <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
        Invite
      </button>

      <Modal open={showModal} setOpen={setShowModal}>
        <div className="p-6">
          <h3 className="font-bold">Invite new member</h3>
          <p className="text-sm text-gray-500">
            This user will able to do everything in this project except delete it or invite other
            members.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <label className="text-sm text-gray-500">Email</label>
            <input type="text" {...register('email')} className="input-primary"></input>
            <InputError message={(errors.email?.message as string) || error || ''}></InputError>

            <Button type="submit" processing={processing} className="mt-4">
              Invite
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default InviteAdd;
