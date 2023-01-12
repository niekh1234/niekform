import Modal from 'components/App/Modal';
import { formatDate, truncate } from 'lib/client/utils';
import { Submission, Form } from 'lib/types';
import { useState } from 'react';
import SubmissionView from './View';

type SubmissionsTableRowProps = {
  submission: Submission;
  form: Form;
  onSubmissionDelete: () => void;
};

const SubmissionsTableRow = ({
  submission,
  form,
  onSubmissionDelete,
  ...props
}: SubmissionsTableRowProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmissionDelete = () => {
    onSubmissionDelete();
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        <SubmissionView
          submission={submission}
          onSubmissionDelete={() => handleSubmissionDelete()}
        ></SubmissionView>
      </Modal>

      <tr
        {...props}
        onClick={() => setOpen(() => true)}
        className="text-sm text-gray-600 border-b hover:bg-gray-50 hover:cursor-pointer"
      >
        <td className="p-4">
          <div className="overflow-hidden whitespace-nowrap">
            {formatDate(submission.createdAt)}
          </div>
        </td>

        {form.fields.map((field) => {
          return (
            <td key={field.id} className="p-4">
              <div className="flex overflow-hidden whitespace-nowrap">
                {truncate(submission.rawdata[field.key], 25)}
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
    </>
  );
};

export default SubmissionsTableRow;
