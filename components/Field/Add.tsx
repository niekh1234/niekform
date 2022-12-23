import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import InputError from 'components/App/InputError';
import Modal from 'components/App/Modal';
import { doPostRequest } from 'lib/client/api';
import { capitalizeFirst, slugify } from 'lib/client/utils';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type FieldAddProps = {
  children?: ReactNode;
  formId: string;
  onAdd: () => void;
};

const schema = yup.object({
  label: yup.string().required('Please enter a name'),
  type: yup.string().default(''),
  required: yup.bool().default(true),
});

const FIELD_TYPES = ['text', 'number', 'email', 'checkbox', 'textarea'];

// @todo show conditional logic for more advanced field creation e.g. select values.
const FieldAdd = ({ children, formId, onAdd }: FieldAddProps) => {
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'text',
      required: true,
      label: '',
    },
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [key, setKey] = useState('');

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value?.label !== undefined && name === 'label') {
        const keyValue = slugify(value.label);

        setKey(() => keyValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: any) => {
    setProcessing(() => true);

    const res = await doPostRequest('/api/admin/field', {
      ...data,
      key: slugify(data.label),
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
            <label className="text-sm text-gray-500">Name</label>
            <input type="text" {...register('label')} className="input-primary"></input>
            <InputError message={(errors.label?.message as string) || error}></InputError>

            <label className="block text-sm text-gray-500" htmlFor="keyField">
              Key
            </label>
            <input
              value={key}
              id="keyField"
              type="text"
              disabled
              className="text-gray-900 bg-gray-200 input-primary"
            />

            <label htmlFor="type" className="block mt-4 text-sm text-gray-500">
              Type
            </label>
            <select id="type" className="bg-white input-primary">
              {FIELD_TYPES.map((field) => (
                <option key={field} value={field}>
                  {capitalizeFirst(field)}
                </option>
              ))}
            </select>
            <InputError message={(errors.type?.type as string) || error}></InputError>

            <label className="block mt-2 text-sm text-gray-500" htmlFor="required">
              Required
            </label>
            <div className="w-6">
              <input
                id="required"
                type="checkbox"
                {...register('required')}
                className="input-primary"
              />
            </div>

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
