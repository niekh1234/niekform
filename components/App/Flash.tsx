import { Portal } from '@headlessui/react';
import { classNames } from 'lib/client/utils';
import React from 'react';
import { useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';

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

  const root = createRoot(containerElement);
  const flash = React.createElement(Flash, { message, type, onClose: () => root.unmount() });
  root.render(flash);

  setTimeout(() => {
    root.unmount();
  }, 5000);
};

const Flash = ({ message, type, onClose }: FlashProps) => {
  return (
    <div
      className={classNames(
        'fixed top-4 right-4 z-50 rounded-xl p-4 max-w-xl shadow',
        backgroundClasses[type]
      )}
    >
      <div className="flex items-center justify-between">
        <div className={classNames('pr-2 text-sm', textClasses[type])}>{message}</div>
        <button className="text-lg font-bold" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Flash;
