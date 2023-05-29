import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import { spawnFlash } from 'components/App/Flash';
import InputError from 'components/App/InputError';
import InputLabel from 'components/App/InputLabel';
import { doPutRequest } from 'lib/client/api';
import { Form } from 'lib/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type TurnstileSettingsProps = {
  form: Form;
  mutate: (data?: any) => void;
};

const schema = yup.object({
  siteKey: yup.string().required('Please enter a site key'),
  secretKey: yup.string().required('Please enter a secret key'),
});

const TurnstileSettings = ({ form, mutate }: TurnstileSettingsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    reset({
      siteKey: form.settings?.captcha?.siteKey || '',
      secretKey: form.settings?.captcha?.secretKey || '',
    });
  }, [form]);

  const onSubmit = async (formData: any) => {
    setProcessing(() => true);

    const res = await doPutRequest('/api/admin/form/' + form.id, {
      settings: {
        captcha: {
          ...formData,
          type: 'turnstile',
        },
      },
    });

    setProcessing(() => false);

    if (res.error) {
      spawnFlash(res.error, 'error');
    } else {
      mutate(res);
      spawnFlash('General settings updated', 'success');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputLabel forInput="siteKey">Site key</InputLabel>

      <input
        {...register('siteKey')}
        className="input-primary"
        id="siteKey"
        placeholder="0xAAAAAAAAAAAAAAA"
      />

      <InputError message={(errors.siteKey?.message as string) || ''} />

      <InputLabel forInput="secretKey" className="mt-4">
        Secret key
      </InputLabel>

      <input
        {...register('secretKey')}
        className="input-primary"
        id="siteKey"
        placeholder="0x4AAAAAAAAAA1234567890abcdef"
      />

      <InputError message={(errors.secretKey?.message as string) || ''} />

      <Button type="submit" isSecondary processing={processing} className="mt-8">
        Save
      </Button>
    </form>
  );
};

export default TurnstileSettings;
