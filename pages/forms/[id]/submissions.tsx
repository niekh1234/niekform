import FormSubmissionsTable from 'components/Submission/Table';
import FormTabs from 'components/Form/Tabs';
import { fetcher } from 'lib/client/api';
import { Form } from 'lib/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import EmptyState from 'components/App/EmptyState';
import Link from 'next/link';
import SearchInput from 'components/App/SearchInput';
import Loading from 'components/App/Loading';
import FormTools from 'components/Form/Tools';
import { useFormSubmissions } from 'lib/client/hooks/useFormSubmissions';
import { useEffect } from 'react';

const FormSubmissions = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error: fetchError, isLoading } = useSWR('/api/admin/form/' + id, fetcher);
  const { mutate, hasFetched } = useFormSubmissions('submissions', id as string, router.query);

  useEffect(() => {
    if (hasFetched) {
      mutate();
    }
  }, [router.query]);

  if (isLoading) {
    return <Loading></Loading>;
  }

  const form = data?.form as Form;

  if (fetchError || !form) return <p>Failed to load</p>;

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{form.name}</h1>

      <FormTabs id={id as string}></FormTabs>

      <div className="flex items-center justify-between mt-8 md:mt-12">
        <SearchInput className="input-primary max-w-[16rem] mr-2"></SearchInput>
        <FormTools form={form} revalidate={mutate}></FormTools>
      </div>

      {form.fields.length === 0 ? (
        <EmptyState type="Field" className="mt-4">
          <Link href={`/forms/${form.id}/fields`} className="btn-primary">
            Create your first field
          </Link>
        </EmptyState>
      ) : (
        <div className="mt-4 overflow-hidden bg-white rounded-lg shadow">
          <FormSubmissionsTable form={form}></FormSubmissionsTable>
        </div>
      )}
    </section>
  );
};

export default FormSubmissions;
