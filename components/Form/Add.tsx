import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import InputError from 'components/App/InputError';
import Modal from 'components/App/Modal';
import ProjectSelect from 'components/Project/Select';
import { doPostRequest } from 'lib/client/api';
import { classNames } from 'lib/client/utils';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

type FormAddProps = {
  children?: ReactNode;
  className?: string;
  onAdd: (id: string) => void;
  forProject?: string;
};

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
  projectId: yup.string().required('Please select a project'),
});

const FormAdd = ({ children, className, onAdd, forProject }: FormAddProps) => {
  const [showModal, setShowModal] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      projectId: forProject || '',
    },
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    setProcessing(() => true);

    const res = await doPostRequest('/api/admin/form', {
      name: data.name,
      projectId: data.projectId,
    });

    setProcessing(() => false);

    if (res.error) {
      setError(() => res.error);
    } else {
      setShowModal(() => false);
      onAdd(res.form.id);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(() => true)}
        type='button'
        className={classNames('inline-flex items-center', className)}
      >
        {children || (
          <>
            <PlusIcon className='w-5 h-5 mr-2 -ml-1' aria-hidden='true' />
            New form
          </>
        )}
      </button>

      <Modal open={showModal} setOpen={setShowModal}>
        <div className='p-6'>
          <h3 className='font-bold'>Add new form</h3>

          <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
            <label className='text-sm text-gray-500'>Name</label>
            <input type='text' {...register('name')} className='input-primary'></input>
            <InputError message={errors.name?.message || error || ''}></InputError>

            <label className='block mt-4 text-sm text-gray-500'>Project</label>
            <Controller
              name='projectId'
              control={control}
              rules={{ required: true }}
              render={({ field }) => <ProjectSelect {...field}></ProjectSelect>}
            ></Controller>
            <InputError message={errors.projectId?.message || error || ''}></InputError>

            <Button type='submit' processing={processing} className='mt-4'>
              Save
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default FormAdd;
