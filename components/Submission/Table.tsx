import { fetcher } from 'lib/client/api';
import { formatDate, truncate } from 'lib/client/utils';
import { Form, Submission } from 'lib/types';
import useSWR from 'swr';
import SubmissionsTableRow from './TableRow';

type FormSubmissionsTableProps = {
  form: Form;
};

const FormSubmissionsTable = ({ form }: FormSubmissionsTableProps) => {
  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR('/api/admin/form/' + form.id + '/submissions', fetcher);

  if (isLoading) return <p>Loading...</p>;

  const submissions = data?.submissions as Submission[];

  if (fetchError || !submissions) return <p>Failed to load</p>;

  return (
    <table className="w-full table-fixed">
      <thead className="font-medium text-gray-500 border-b">
        <tr className="text-sm bg-gray-50">
          <th className="py-4 w-[20%]">Added</th>

          {form.fields.map((field) => (
            <th key={field.id} className="py-4">
              {field.label}
            </th>
          ))}

          <th className="w-[10%] py-4">Options</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <SubmissionsTableRow
            submission={submission}
            form={form}
            onSubmissionDelete={() => mutate()}
          ></SubmissionsTableRow>
        ))}
      </tbody>
    </table>
  );
};

export default FormSubmissionsTable;
