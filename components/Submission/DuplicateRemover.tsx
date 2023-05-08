import Button from 'components/App/Button';
import ConfirmButton from 'components/App/ConfirmButton';
import { spawnFlash } from 'components/App/Flash';
import Loading from 'components/App/Loading';
import Modal from 'components/App/Modal';
import { doDeleteRequest, doPostRequest, fetcher } from 'lib/client/api';
import { classNames, formatDate } from 'lib/client/utils';
import { Form, Submission } from 'lib/types';
import { useState } from 'react';
import useSWR from 'swr';

type DuplicateRemoverProps = {
  form: Form;
  showDuplicateRemover: boolean;
  setShowDuplicateRemover: (show: boolean) => void;
};

const DuplicateRemover = ({
  form,
  showDuplicateRemover,
  setShowDuplicateRemover,
}: DuplicateRemoverProps) => {
  return (
    <Modal open={showDuplicateRemover} setOpen={setShowDuplicateRemover} className="sm:!max-w-2xl">
      <div className="p-6">
        <DuplicateRemoverContent
          form={form}
          onClose={() => setShowDuplicateRemover(() => false)}
        ></DuplicateRemoverContent>
      </div>
    </Modal>
  );
};

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

  return (
    <div>
      <h3 className="font-bold">Remove duplicates</h3>

      {duplicateSubmissions.length !== 0 ? (
        <ul className="mt-6">
          {duplicateSubmissions.map((submission, index) => (
            <li
              key={submission.id}
              className={classNames(
                'flex items-center space-x-2 text-xs px-2',
                index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
              )}
            >
              <div>{index + 1}</div>
              <div className=" whitespace-nowrap">{formatDate(submission.createdAt)}</div>
              <div className="overflow-scroll whitespace-nowrap py-4 text-gray-700">
                {JSON.stringify(submission.rawdata)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 mt-2">There are no duplicate submissions at this time.</div>
      )}

      <Button onClick={() => removeDuplicates()} processing={processing} className="mt-4">
        Remove
      </Button>
    </div>
  );
};

export default DuplicateRemover;
