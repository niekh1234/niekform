import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ConfirmButton from 'components/App/ConfirmButton';
import { spawnFlash } from 'components/App/Flash';
import Loading from 'components/App/Loading';
import GeneralSettings from 'components/Form/Settings/General';
import NotificationSettings from 'components/Form/Settings/Notification';
import FormTabs from 'components/Form/Tabs';
import { doDeleteRequest, fetcher } from 'lib/client/api';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const FormSettings = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading, mutate } = useSWR('/api/admin/form/' + id, fetcher);

  const deleteForm = async () => {
    const res = await doDeleteRequest('/api/admin/form/' + id);

    if (res.error) {
      spawnFlash(res.error, 'error');
    } else {
      router.push('/forms');
    }
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <GeneralSettings form={form} mutate={mutate}></GeneralSettings>

      <NotificationSettings form={form} mutate={mutate}></NotificationSettings>

      <div className="mt-12">
        <ConfirmButton onClick={() => deleteForm()} extraCaution extraCautionText={form.name}>
          <div className="flex items-center space-x-2 btn-outline">
            <ExclamationCircleIcon className="w-4 h-4"></ExclamationCircleIcon>
            <span>Delete form</span>
          </div>
        </ConfirmButton>
      </div>
    </section>
  );
};

export default FormSettings;
