import { Form, Submission } from 'lib/types';
import Button from 'components/App/Button';
import { spawnFlash } from 'components/App/Flash';
import Loading from 'components/App/Loading';
import { fetcher, doDeleteRequest } from 'lib/client/api';
import { classNames, formatDate } from 'lib/client/utils';
import { useState } from 'react';
import useSWR from 'swr';

type DuplicateRemoverContentProps = {
  form: Form;
  onClose: () => void;
};

const DuplicateRemoverContent = ({ form, onClose }: DuplicateRemoverContentProps) => {
  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR('/api/admin/form/' + form.id + '/duplicates', fetcher);

  const [processing, setProcessing] = useState(false);

  const removeDuplicates = async () => {
    setProcessing(() => true);

    const ids = data?.duplicateSubmissions.map((submission: Submission) => submission.id);
    const res = await doDeleteRequest('/api/admin/form/' + form.id + '/duplicates', {
      ids,
    });

    setProcessing(() => false);
    onClose();
    spawnFlash('Removed duplicates', 'success');
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  const duplicateSubmissions = data?.duplicateSubmissions as Submission[];

  if (fetchError || !duplicateSubmissions) return <p>Failed to load</p>;

  if (duplicateSubmissions.length === 0) {
    return (
      <div>
        <h3 className="font-bold">Remove duplicates</h3>

        <div className="text-gray-500 mt-2">There are no duplicate submissions at this time.</div>

        <Button onClick={() => onClose()} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-bold">Remove duplicates</h3>

      <ul className="mt-6">
        {duplicateSubmissions.map((submission, index) => (
          <li
            key={submission.id}
            className={classNames(
              'flex items-center space-x-2 text-xs px-2 overflow-auto whitespace-nowrap',
              index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
            )}
          >
            <div>{index + 1}</div>
            <div className="whitespace-nowrap">{formatDate(submission.createdAt)}</div>
            <div className="py-4 text-gray-700">{JSON.stringify(submission.rawdata)}</div>
          </li>
        ))}
      </ul>

      <Button onClick={() => removeDuplicates()} processing={processing} className="mt-4">
        Remove
      </Button>
    </div>
  );
};

export default DuplicateRemoverContent;
