import Button from 'components/App/Button';
import Modal from 'components/App/Modal';
import { useState } from 'react';

type SubmissionExportProps = {
  formId: string;
};

const SubmissionExport = ({ formId }: SubmissionExportProps) => {
  const [showModal, setShowModal] = useState(false);
  const [exportType, setExportType] = useState('csv');

  return (
    <>
      <Button onClick={() => setShowModal(() => true)} isOutline className="block">
        Export
      </Button>

      <Modal open={showModal} setOpen={setShowModal}>
        <div className="p-6">
          <h1 className="font-bold">Export submissions</h1>

          <p className="text-gray-500 text-sm">Max 50.000</p>

          <select
            value={exportType}
            onChange={(e) => setExportType(() => e.target.value)}
            className="input-primary mt-4"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>

          <a
            href={`/api/admin/submission/export?formId=${formId}&type=${exportType}`}
            className="mt-6 btn-primary inline-block"
          >
            Export
          </a>
        </div>
      </Modal>
    </>
  );
};

export default SubmissionExport;
