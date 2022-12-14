import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { classNames } from 'lib/client/utils';
import React from 'react';
import { createRoot } from 'react-dom/client';

type FlashProps = {
  message: string;
  type: 'success' | 'warning' | 'error';
  onClose: () => void;
};

const backgroundClasses = {
  success: 'bg-emerald-200',
  warning: 'bg-yellow-100',
  error: 'bg-red-100',
};

const textClasses = {
  success: 'text-emerald-900',
  warning: 'text-yellow-900',
  error: 'text-red-900',
};

export const spawnFlash = (message: string, type: 'success' | 'warning' | 'error') => {
  const containerElement = document.getElementById('niekform-flash');

  if (!containerElement) {
    return;
  }

  if (containerElement.childElementCount > 0) {
    return;
  }

  let isAlive = true;

  const root = createRoot(containerElement);
  const flash = React.createElement(Flash, { message, type, onClose: () => unmount() });
  root.render(flash);

  setTimeout(() => {
    unmount();
  }, 5000);

  const unmount = () => {
    if (isAlive) {
      root.unmount();
      isAlive = false;
    }
  };
};

const Flash = ({ message, type, onClose }: FlashProps) => {
  return (
    <div
      className={classNames(
        'fixed top-4 right-4 z-50 rounded-xl px-4 py-2 max-w-xl shadow-lg',
        backgroundClasses[type],
      )}
    >
      <div className={classNames('flex items-center justify-between', textClasses[type])}>
        <div className='pr-2'>
          {type === 'success' && <CheckCircleIcon className='w-5 h-5'></CheckCircleIcon>}
          {type === 'warning' && (
            <ExclamationCircleIcon className='w-5 h-5'></ExclamationCircleIcon>
          )}
          {type === 'error' && (
            <ExclamationTriangleIcon className='w-5 h-5'></ExclamationTriangleIcon>
          )}
        </div>
        <div className='pr-4 text-sm'>{message}</div>
        <button className='text-lg font-bold' onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Flash;
