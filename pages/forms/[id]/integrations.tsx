import CopyButton from 'components/App/CopyButton';
import Loading from 'components/App/Loading';
import FormTabs from 'components/Form/Tabs';
import { fetcher } from 'lib/client/api';
import { generateHTMLForm, generateReactCompatibleForm } from 'lib/client/forms/integrate';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

const integrations = [
  {
    name: 'HTML',
    value: 'html',
  },
  {
    name: 'React',
    value: 'react',
  },
];

const getIntegration = (type: string, form: Form) => {
  if (!form) return null;

  switch (type) {
    case 'html':
      return generateHTMLForm(form);
    case 'react':
      return generateReactCompatibleForm(form);
    default:
      return generateHTMLForm(form);
  }
};

const FormIntegrations = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading } = useSWR('/api/admin/form/' + id, fetcher);
  const [integrationType, setIntegrationType] = useState('html' as string);

  const integration = useMemo(
    () => getIntegration(integrationType, data?.form as Form),
    [integrationType, data]
  );

  if (isLoading) {
    return <Loading></Loading>;
  }

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  const endpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/f/${form.id}`;

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <div className="mt-8 overflow-hidden bg-white rounded-lg md:mt-12">
        <div className="p-6">
          <div className="">
            <h3 className="font-bold">Your form endpoint</h3>

            <div className="flex items-center justify-between p-2 mt-2 overflow-auto border rounded-lg">
              <div className="text-gray-700 whitespace-nowrap">{endpoint}</div>
              <CopyButton value={endpoint} className="ml-4 btn-secondary"></CopyButton>
            </div>
          </div>

          <div className="flex justify-between mt-8 md:mt-12">
            <h3 className="font-bold">Add to your website</h3>

            <select
              className="px-4 py-2 bg-gray-100 rounded"
              onChange={(e) => setIntegrationType(() => e.target.value)}
              value={integrationType}
            >
              {integrations.map((integration) => (
                <option key={integration.value} value={integration.value}>
                  {integration.name}
                </option>
              ))}
            </select>
          </div>

          {form.fields.length === 0 && (
            <blockquote className="py-1 pl-2 mt-4 border-l-4 border-red-400">
              <p className="text-gray-600">
                You have not created any fields yet, that might be a good idea!
              </p>
            </blockquote>
          )}

          <pre className="p-6 mt-8 overflow-auto text-gray-300 bg-gray-900 rounded-lg">
            {integration}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default FormIntegrations;
