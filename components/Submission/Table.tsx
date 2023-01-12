import Loading from 'components/App/Loading';
import Pagination from 'components/App/Pagination';
import { fetcher } from 'lib/client/api';
import { capitalizeFirst } from 'lib/client/utils';
import { Form, Submission } from 'lib/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import SubmissionsTableRow from './TableRow';

type FormSubmissionsTableProps = {
  form: Form;
};

const buildQuery = (query: any) => {
  const params: any = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    params.append(key, value);
  }

  return params.toString();
};

const FormSubmissionsTable = ({ form }: FormSubmissionsTableProps) => {
  const router = useRouter();
  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR('/api/admin/form/' + form.id + '/submissions?' + buildQuery(router.query), fetcher);

  if (isLoading) {
    return <Loading></Loading>;
  }

  const submissions = data?.submissions as Submission[];
  const pagination = data?.pagination;

  if (fetchError || !submissions) return <p>Failed to load</p>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="font-medium text-gray-500 border-b">
            <tr className="text-sm bg-gray-50">
              <th className="py-4 w-[20%]">Added</th>

              {form.fields.map((field) => (
                <th key={field.id} className="py-4 overflow-hidden whitespace-nowrap">
                  {capitalizeFirst(field.label)}
                </th>
              ))}

              <th className="w-[10%] py-4 pl-4">Options</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <SubmissionsTableRow
                submission={submission}
                form={form}
                onSubmissionDelete={() => mutate()}
                key={submission.id}
              ></SubmissionsTableRow>
            ))}
          </tbody>
        </table>
      </div>

      {submissions.length === 0 && (
        <div className="p-6">
          <h3 className="font-bold">No submissions yet</h3>
          <p>Check the integration tap above to get started collection submissions</p>
        </div>
      )}

      <Pagination
        total={pagination.total}
        page={pagination.page}
        linkBlueprint={`/forms/${form.id}/submissions?page=:page`}
        perPage={50}
      ></Pagination>
    </>
  );
};

export default FormSubmissionsTable;
