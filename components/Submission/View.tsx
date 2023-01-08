import { spawnFlash } from 'components/App/Flash';
import { doDeleteRequest } from 'lib/client/api';
import { capitalizeFirst } from 'lib/client/utils';
import { Submission } from 'lib/types';

type SubmissionViewProps = {
  submission: Submission;
  onSubmissionDelete: () => void;
};

const SubmissionView = ({ submission, onSubmissionDelete }: SubmissionViewProps) => {
  const handleRemove = async () => {
    const res = await doDeleteRequest('/api/admin/submission/' + submission.id);

    if (res.error) {
      spawnFlash(res.error, 'error');
    } else {
      spawnFlash('Submission removed successfully', 'success');
      onSubmissionDelete();
    }
  };

  return (
    <div>
      <div className="p-6">
        <h3 className="text-lg font-bold">Raw data</h3>
        <div className="flex flex-col mt-6 space-y-4 text-sm">
          {Object.entries(submission.rawdata).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="w-1/3">
                <strong>{capitalizeFirst(key)}</strong>
              </span>
              <span className="w-2/3">{value as any}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end px-6 py-4 bg-gray-50">
        <button onClick={() => handleRemove()} className="btn-danger">
          Remove
        </button>
      </div>
    </div>
  );
};

export default SubmissionView;
