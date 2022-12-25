import FormTabs from 'components/Form/Tabs';
import { fetcher } from 'lib/client/api';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const FormIntegrations = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading } = useSWR('/api/admin/form/' + id, fetcher);

  if (isLoading) return <p>Loading...</p>;

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <div className="mt-6 overflow-hidden bg-white rounded-lg">
        <div className="p-6">
          <h3 className="font-bold">Add to your website</h3>

          <pre className="bg-gray-900 text-gray-300 rounded-lg mt-8 p-6">
            {generateHTMLForm(form)}
          </pre>
        </div>
      </div>
    </section>
  );
};

const generateHTMLForm = (form: Form) => {
  return `<form action="${process.env.NEXT_PUBLIC_SITE_URL}/f/${form.id}" method="POST">
${form.fields
  .map(
    (field) => `  <label for="${field.key}">${field.label}</label>
  <input id="${field.key}" type="text"></input>`
  )
  .join('\n')} 
</form>`;
};

export default FormIntegrations;
