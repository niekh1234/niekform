import Modal from 'components/App/Modal';
import { useState } from 'react';

type SubmissionExportProps = {
  formId: string;
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
};

const SubmissionExport = ({
  formId,
  showExportModal: showModal,
  setShowExportModal,
}: SubmissionExportProps) => {
  const [exportType, setExportType] = useState('csv');

  return (
    <Modal open={showModal} setOpen={setShowExportModal}>
      <div className="p-6">
        <h3 className="font-bold">Export submissions</h3>

        <p className="text-sm text-gray-500">Max 50.000</p>

        <select
          value={exportType}
          onChange={(e) => setExportType(() => e.target.value)}
          className="mt-4 input-primary"
        >
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>

        <a
          href={`/api/admin/submission/export?formId=${formId}&type=${exportType}`}
          className="inline-block mt-6 btn-primary"
        >
          Export
        </a>
      </div>
    </Modal>
  );
};

export default SubmissionExport;
