import Loading from 'components/App/Loading';
import Pagination from 'components/App/Pagination';
import { capitalizeFirst } from 'lib/client/utils';
import { Form, Submission } from 'lib/types';
import { useRouter } from 'next/router';
import SubmissionsTableRow from './TableRow';
import { useFormSubmissions } from 'lib/client/hooks/useFormSubmissions';

type FormSubmissionsTableProps = {
  form: Form;
};

const FormSubmissionsTable = ({ form }: FormSubmissionsTableProps) => {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useFormSubmissions(
    'submissions',
    form.id,
    router.query
  );

  if (isLoading) {
    return <Loading></Loading>;
  }

  const submissions = data?.submissions as Submission[];
  const pagination = data?.pagination;

  if (error || !submissions) return <p>Failed to load</p>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="font-medium text-gray-500 border-b">
            <tr className="text-xs sm:text-sm bg-gray-50">
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
          <h3 className="font-bold">No submissions found</h3>
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
