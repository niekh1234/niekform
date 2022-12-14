import { fetcher } from 'lib/client/api';
import { formatDate } from 'lib/client/utils';
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
    <table className='w-full mt-8 table-fixed'>
      <thead className='font-medium text-gray-500 border-b'>
        <tr className='text-sm'>
          <th className='pb-4 w-[20%]'>Added</th>

          {form.fields.map((field) => (
            <th key={field.id} className='pb-4'>
              {field.name}
            </th>
          ))}

          <th className='w-[10%] pb-4'>Options</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission, index) => (
          <tr
            key={submission.id}
            className='text-sm text-gray-700 border-b hover:bg-gray-50 hover:cursor-pointer'
          >
            <td className='px-4 py-2'>
              <div className='h-10 overflow-auto'>{formatDate(submission.createdAt)}</div>
            </td>

            {form.fields.map((field) => {
              const key = field.name.toLowerCase().replace(/ /g, '_');

              return (
                <td key={field.id} className='py-2 pr-2'>
                  <div className='flex h-10 overflow-hidden '>{submission.data[key]}</div>
                </td>
              );
            })}

            <td className='py-2'>
              <div className='flex items-center justify-center h-10'>
                <button className='text-emerald-600'>Edit</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// const transformSubmissions = (submissions: Submission[], form: Form) => {
//   return submissions.map((submission) => {
//     const transformedSubmission: any = {
//       id: submission.id,
//       createdAt: submission.createdAt,
//     };

//     form.fields.forEach((field) => {
//       const key = field.name.toLowerCase().replace(/ /g, '_');
//       transformedSubmission[key] = submission.data[key];
//     });

//     return transformedSubmission;
//   });
// };

export default FormSubmissionsTable;
