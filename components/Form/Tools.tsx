import { Form } from 'lib/types';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { DocumentArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import SubmissionExport from 'components/Submission/Export';
import DuplicateRemover from 'components/Submission/DuplicateRemover';

type FormToolsProps = {
  form: Form;
};

const FormTools = ({ form }: FormToolsProps) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDuplicateRemover, setShowDuplicateRemover] = useState(false);

  return (
    <>
      <SubmissionExport
        formId={form.id}
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
      ></SubmissionExport>

      <DuplicateRemover
        form={form}
        showDuplicateRemover={showDuplicateRemover}
        setShowDuplicateRemover={setShowDuplicateRemover}
      ></DuplicateRemover>

      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="btn-outline !p-[0.4rem] h-9 w-9">
            <EllipsisVerticalIcon className="w-full h-full"></EllipsisVerticalIcon>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setShowExportModal(true)}
                    className={`${
                      active ? 'bg-emerald-500 text-white' : 'text-gray-500'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                    Export
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setShowDuplicateRemover(true)}
                    className={`${
                      active ? 'bg-emerald-500 text-white' : 'text-gray-500'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Remove duplicates
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default FormTools;
