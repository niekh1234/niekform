import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import { spawnFlash } from 'components/App/Flash';
import InputError from 'components/App/InputError';
import { doPutRequest } from 'lib/client/api';
import { Form } from 'lib/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type GeneralSettingsProps = {
  form: Form;
  mutate: (data?: any) => void;
};

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
});

const GeneralSettings = ({ form, mutate }: GeneralSettingsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [processing, setProcessing] = useState(false);

  // set initial form values
  useEffect(() => {
    if (form) {
      reset({
        name: form.name,
      });
    }
  }, [form]);

  const onSubmit = async (formData: any) => {
    setProcessing(() => true);

    const res = await doPutRequest('/api/admin/form/' + form.id, {
      name: formData.name,
    });

    setProcessing(() => false);

    if (res.error && !res?.project) {
      spawnFlash(res.error, 'error');
    } else {
      mutate(res);
      spawnFlash('General settings updated', 'success');
    }
  };

  return (
    <div className="p-4 mt-8 bg-white rounded-lg shadow md:mt-12 md:p-6">
      <h3 className="font-bold">General</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="text-sm text-gray-500" htmlFor="name">
          Name
        </label>
        <input type="text" {...register('name')} id="name" className="input-primary"></input>
        <InputError message={(errors.name?.message as string) || ''}></InputError>

        <Button type="submit" isSecondary processing={processing} className="mt-8">
          Save
        </Button>
      </form>
    </div>
  );
};

export default GeneralSettings;
