import Modal from 'components/App/Modal';
import { useState } from 'react';
import { spawnFlash } from './Flash';

type ConfirmButtonProps = {
  children: React.ReactNode;
  extraCaution?: boolean;
  extraCautionText?: string;
  onClick: () => void;
};

const ConfirmButton = ({
  children,
  onClick,
  extraCaution,
  extraCautionText,
  ...props
}: ConfirmButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');

  const handleConfirm = () => {
    setShowModal(false);
    onClick();
  };

  return (
    <>
      <button onClick={() => setShowModal(() => true)} {...props}>
        {children}
      </button>

      <Modal open={showModal} setOpen={setShowModal}>
        <div className="overflow-hidden rounded">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-700">Are you sure?</h3>
            <p className="text-sm text-gray-500">
              This action is irriversible, you're sure you want to do this?
            </p>

            {extraCaution && (
              <div className="mt-6">
                <label htmlFor="extra-caution" className="block text-xs font-bold text-gray-700">
                  Please type "{extraCautionText}" to confirm.
                </label>
                <input
                  id="extra-caution"
                  type="text"
                  className="rounded px-4 py-2 bg-gray-100 w-full mt-2 focus:outline-none text-sm"
                  value={confirmationInput}
                  placeholder={extraCautionText}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="px-6 py-4 space-x-6 bg-gray-50">
            <button
              disabled={extraCaution && confirmationInput !== extraCautionText}
              onClick={handleConfirm}
              className="btn-danger disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <button onClick={() => setShowModal(false)} className="btn-text">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmButton;
