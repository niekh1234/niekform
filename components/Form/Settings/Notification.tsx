import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import { spawnFlash } from 'components/App/Flash';
import InputError from 'components/App/InputError';
import { doPutRequest } from 'lib/client/api';
import { Form } from 'lib/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type NotificationSettingsProps = {
  form: Form;
  mutate: (data?: any) => void;
};

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
  enabled: yup.bool(),
});

const NotificationSettings = ({ form, mutate }: NotificationSettingsProps) => {
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
      spawnFlash('Notification settings updated', 'success');
    }
  };

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow md:p-6">
      <h3 className="font-bold">Email & notifications</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="text-sm text-gray-500">E-mail</label>
        <input type="text" {...register('name')} className="input-primary"></input>
        <InputError message={(errors.name?.message as string) || ''}></InputError>

        <Button type="submit" isSecondary processing={processing} className="mt-8">
          Save
        </Button>
      </form>

      <h3 className="font-bold mt-8">Configuration</h3>
      <p className="text-gray-500 text-sm">
        Please review our documentation as to how to setup your e-mail notification.
      </p>

      <Button isOutline className="mt-4">
        Test email configuration
      </Button>
    </div>
  );
};

export default NotificationSettings;
