import Button from 'components/App/Button';
import { spawnFlash } from 'components/App/Flash';
import { doPutRequest } from 'lib/client/api';
import { Form } from 'lib/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type TurnstileSettingsProps = {
  form: Form;
  mutate: (data?: any) => void;
};

const NoCaptchaSettings = ({ form, mutate }: TurnstileSettingsProps) => {
  const { handleSubmit } = useForm();
  const [processing, setProcessing] = useState(false);

  const onSubmit = async (formData: any) => {
    setProcessing(() => true);

    const res = await doPutRequest('/api/admin/form/' + form.id, {
      settings: {
        captcha: {},
      },
    });

    setProcessing(() => false);

    if (res.error) {
      spawnFlash(res.error, 'error');
    } else {
      mutate(res);
      spawnFlash('Captcha settings updated', 'success');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" isSecondary processing={processing} className="mt-8">
        Save
      </Button>
    </form>
  );
};

export default NoCaptchaSettings;
