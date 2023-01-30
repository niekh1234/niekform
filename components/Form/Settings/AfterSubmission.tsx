import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import { spawnFlash } from 'components/App/Flash';
import InputError from 'components/App/InputError';
import { doPutRequest } from 'lib/client/api';
import { Form } from 'lib/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

type AfterSubmissionSettingsProps = {
  form: Form;
  mutate: (data?: any) => void;
};

const schema = yup.object({
  thankYouHeader: yup.string(),
  thankYouBody: yup.string(),
  errorHeader: yup.string(),
});

const AfterSubmissionSettings = ({ form, mutate }: AfterSubmissionSettingsProps) => {
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
    if (form && form.settings) {
      reset({
        thankYouHeader: form?.settings?.thankYouHeader,
        thankYouBody: form?.settings?.thankYouBody,
        errorHeader: form?.settings?.errorHeader,
      });
    }
  }, [form]);

  const onSubmit = async (formData: any) => {
    setProcessing(() => true);

    const res = await doPutRequest('/api/admin/form/' + form.id, {
      settings: {
        thankYouHeader: formData?.thankYouHeader,
        thankYouBody: formData?.thankYouBody,
        errorHeader: formData?.errorHeader,
      },
    });

    setProcessing(() => false);

    if (res.error && !res?.project) {
      spawnFlash(res.error, 'error');
    } else {
      mutate(res);
      spawnFlash('Submission thank-you settings updated', 'success');
    }
  };

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow md:p-6">
      <h3 className="font-bold">After submission messages</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="text-sm text-gray-500">Thank you header</label>
        <input
          type="text"
          {...register('thankYouHeader')}
          className="input-primary"
          placeholder="Thank you"
        ></input>
        <InputError message={(errors.thankYouHeader?.message as string) || ''}></InputError>

        <label className="text-sm text-gray-500 mt-2 block">Thank you body</label>
        <input
          type="text"
          {...register('thankYouBody')}
          className="input-primary"
          placeholder="Your submission has been received in good hands"
        ></input>
        <InputError message={(errors.thankYouBody?.message as string) || ''}></InputError>

        <hr className="border-t mt-4"></hr>

        <label className="text-sm text-gray-500 mt-4 block">Error</label>
        <input
          type="text"
          {...register('errorHeader')}
          className="input-primary"
          placeholder="Something went wrong..."
        ></input>
        <InputError message={(errors.errorHeader?.message as string) || ''}></InputError>

        <Button type="submit" isSecondary processing={processing} className="mt-8">
          Save
        </Button>
      </form>
    </div>
  );
};

export default AfterSubmissionSettings;
