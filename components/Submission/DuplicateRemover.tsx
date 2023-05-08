import Modal from 'components/App/Modal';
import { Form } from 'lib/types';
import DuplicateRemoverContent from './DuplicateRemoverContent';

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
          onClose={() => setShowDuplicateRemover(false)}
        ></DuplicateRemoverContent>
      </div>
    </Modal>
  );
};

export default DuplicateRemover;
