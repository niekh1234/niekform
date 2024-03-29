import { classNames } from 'lib/client/utils';
import { Dialog, Portal, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type ModalProps = {
  open: boolean;
  setOpen: any;
  children: React.ReactNode;
  className?: string;
};

const Modal = ({ open, setOpen, children, className }: ModalProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Portal>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className={classNames(
                  'inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 w-full sm:max-w-lg sm:align-middle',
                  className
                )}
              >
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Portal>
    </Transition.Root>
  );
};

export default Modal;
