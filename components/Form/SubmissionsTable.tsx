import { fetcher } from 'lib/client/api';
import { formatDate, truncate } from 'lib/client/utils';
import { Form, Submission } from 'lib/types';
import useSWR from 'swr';

type FormSubmissionsTableProps = {
  form: Form;
};

const FormSubmissionsTable = ({ form }: FormSubmissionsTableProps) => {
  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR('/api/admin/submission/' + form.id, fetcher);

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
          <tr
            key={submission.id}
            className="text-sm text-gray-600 border-b hover:bg-gray-50 hover:cursor-pointer"
          >
            <td className="p-4">
              <div className="overflow-auto">{formatDate(submission.createdAt)}</div>
            </td>

            {form.fields.map((field) => {
              const key = field.key.toLowerCase().replace(/ /g, '_');

              return (
                <td key={field.id} className="p-4">
                  <div className="flex overflow-hidden whitespace-nowrap">
                    {truncate(submission.data[key], 25)}
                  </div>
                </td>
              );
            })}

            <td className="p-4">
              <div className="flex items-center justify-center">
                <button className="text-emerald-600">Edit</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormSubmissionsTable;
