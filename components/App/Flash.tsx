import { Portal } from '@headlessui/react';
import { classNames } from 'lib/client/utils';
import React from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type FlashProps = {
  message: string;
  type: 'success' | 'warning' | 'error';
  onClose: () => void;
};

const backgroundClasses = {
  success: 'bg-green-200',
  warning: 'bg-yellow-200',
  error: 'bg-red-200',
};

const textClasses = {
  success: 'text-green-900',
  warning: 'text-yellow-900',
  error: 'text-red-900',
};

export const spawnFlash = (message: string, type: 'success' | 'warning' | 'error') => {
  const flash = React.createElement(Flash, { message, type, onClose: removeFlash });
  ReactDOM.render(flash, document.getElementById('niekform-flash'));

  setTimeout(() => {
    removeFlash();
  }, 5000);

  return removeFlash;
};

const removeFlash = () => {
  const el = document.getElementById('niekform-flash');

  if (el) {
    ReactDOM.unmountComponentAtNode(el);
  }
};

const Flash = ({ message, type, onClose }: FlashProps) => {
  return (
    <div
      className={classNames(
        'fixed top-4 right-4 z-50 rounded-xl p-4 max-w-xl',
        backgroundClasses[type]
      )}
    >
      <div className="flex items-center justify-between">
        <div className={classNames('pr-2', textClasses[type])}>{message}</div>
        <button className="text-lg font-bold" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Flash;
