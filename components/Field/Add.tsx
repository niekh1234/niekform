import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import InputError from 'components/App/InputError';
import Modal from 'components/App/Modal';
import { doPostRequest } from 'lib/client/api';
import { capitalizeFirst } from 'lib/client/utils';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type FieldAddProps = {
  children?: ReactNode;
  formId: string;
  onAdd: () => void;
};

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
  type: yup.string().default(''),
  required: yup.bool().default(true),
});

const FIELD_TYPES = ['text', 'number', 'email', 'date', 'checkbox', 'radio', 'select', 'textarea'];

// @todo show conditional logic for more advanced field creation e.g. select values.
const FieldAdd = ({ children, formId, onAdd }: FieldAddProps) => {
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

    const res = await doPostRequest('/api/admin/field', {
      ...data,
      formId,
    });

    setProcessing(() => false);

    if (res.error) {
      setError(() => res.error);
    } else {
      setShowModal(() => false);
      onAdd();
    }
  };

  if (!formId) {
    alert('Internal error');
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(() => true)}
        type="button"
        className="inline-flex items-center btn-primary"
      >
        <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
        Add field
      </button>

      <Modal open={showModal} setOpen={setShowModal}>
        <div className="p-6">
          <h3 className="font-bold">Add new field</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <label htmlFor="type" className="text-sm text-gray-500">
              Type
            </label>
            <select id="type" className="input-primary bg-white">
              {FIELD_TYPES.map((field) => (
                <option key={field} value={field}>
                  {capitalizeFirst(field)}
                </option>
              ))}
            </select>
            <InputError message={(errors.type?.type as string) || error}></InputError>

            <label className="text-sm text-gray-500">Name</label>
            <input type="text" {...register('name')} className="input-primary"></input>
            <InputError message={(errors.name?.message as string) || error}></InputError>

            <label className="mt-4 text-sm text-gray-500">Description (optional)</label>
            <textarea {...register('description')} className="input-primary"></textarea>
            <InputError message={(errors.description?.message as string) || error}></InputError>

            <Button type="submit" processing={processing} className="mt-4">
              Save
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default FieldAdd;
