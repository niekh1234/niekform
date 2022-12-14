import Modal from 'components/App/Modal';
import { useState } from 'react';

type ConfirmButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const ConfirmButton = ({ children, onClick, ...props }: ConfirmButtonProps) => {
  const [showModal, setShowModal] = useState(false);

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
        <div className='overflow-hidden rounded'>
          <div className='p-6'>
            <h3 className='text-lg font-bold text-gray-700'>Are you sure?</h3>
            <p className='text-sm text-gray-500'>
              This action is irriversible, you're sure you want to do this?
            </p>
          </div>
          <div className='px-6 py-4 space-x-6 bg-gray-50'>
            <button onClick={handleConfirm} className='btn-danger'>
              Delete
            </button>
            <button onClick={() => setShowModal(false)} className='btn-text'>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmButton;
