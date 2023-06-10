import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import CopyButton from 'components/App/CopyButton';
import Loading from 'components/App/Loading';
import FormTabs from 'components/Form/Tabs';
import { fetcher } from 'lib/client/api';
import { generateHTMLForm, generateReactCompatibleForm } from 'lib/client/forms/integrate';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import Script from 'next/script';
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

          <div className="flex items-center justify-between mt-8 md:mt-12">
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

          {form.fields.length === 0 ? (
            <div className="mt-8 flex items-center space-x-4">
              <div className="p-2 bg-red-50 text-red-600 rounded">
                <ExclamationCircleIcon className="w-6 h-6"></ExclamationCircleIcon>
              </div>
              <div>
                <p className="text-gray-600">
                  You have not created any fields yet, that might be a good idea!
                </p>
              </div>
            </div>
          ) : (
            <pre className="p-6 mt-8 overflow-auto text-gray-300 bg-gray-900 rounded-lg">
              {integration}
            </pre>
          )}

          {!!form?.settings?.captcha?.type && (
            <div className="mt-8 flex items-center space-x-4">
              <div className="p-2 bg-red-50 text-red-600 rounded">
                <ExclamationCircleIcon className="w-6 h-6"></ExclamationCircleIcon>
              </div>
              <div>
                <h3 className="font-bold">Captcha</h3>
                <p className="text-gray-600">
                  This form has captcha enabled, don't forget to add it's script (different per
                  provider) to your website.
                </p>
              </div>
            </div>
          )}

          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async={true}
            defer={true}
          />

          <form
            action="http://localhost:3000/api/f/clhm5kk7r0002w7oalh61yva4"
            method="POST"
            className="flex flex-col bg-green-500"
          >
            <label htmlFor="name">Name</label>
            <input id="name" type="text" name="name" required></input>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required></input>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message"></textarea>
            {/* 
            <div
              className="cf-turnstile checkbox"
              data-sitekey="0x4AAAAAAAEtlJd_kUp3SCNx"
              data-theme="light"
            ></div> */}

            <input
              type="text"
              name="a_password"
              style={{ display: 'none !important' }}
              tabIndex={-1}
              autoComplete="off"
            ></input>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormIntegrations;
