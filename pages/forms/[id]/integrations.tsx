import Loading from 'components/App/Loading';
import FormTabs from 'components/Form/Tabs';
import { fetcher } from 'lib/client/api';
import { generateHTMLForm } from 'lib/client/forms/integrate';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const FormIntegrations = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading } = useSWR('/api/admin/form/' + id, fetcher);

  if (isLoading) {
    return <Loading></Loading>;
  }

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <div className="mt-6 overflow-hidden bg-white rounded-lg">
        <div className="p-6">
          <h3 className="font-bold">Add to your website</h3>

          {form.fields.length === 0 && (
            <blockquote className="py-1 border-l-4 border-red-400 mt-4 pl-2">
              <p className="text-gray-600">
                You have not created any fields yet, that might be a good idea!
              </p>
            </blockquote>
          )}

          <pre className="bg-gray-900 text-gray-300 rounded-lg mt-8 p-6 overflow-auto">
            {generateHTMLForm(form)}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default FormIntegrations;
