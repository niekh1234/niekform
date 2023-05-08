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
  sendTo: yup.string().email('Please enter a valid email address.'),
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
    if (form && form.notificationSettings) {
      reset({
        sendTo: form?.notificationSettings?.sendTo,
      });
    }
  }, [form]);

  const onSubmit = async (formData: any) => {
    setProcessing(() => true);

    const res = await doPutRequest('/api/admin/form/' + form.id, {
      notificationSettings: {
        sendTo: formData?.sendTo,
      },
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
        <label className="text-sm text-gray-500">Send notifications to</label>
        <input type="text" {...register('sendTo')} className="input-primary"></input>
        <InputError message={(errors.sendTo?.message as string) || ''}></InputError>

        <Button type="submit" isSecondary processing={processing} className="mt-8">
          Save
        </Button>
      </form>
    </div>
  );
};

export default NotificationSettings;
