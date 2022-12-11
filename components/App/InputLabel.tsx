import React from 'react';

type InputLabelProps = {
  forInput: string;
  value?: string;
  className?: string;
  children?: React.ReactNode;
};

const InputLabel = ({
  forInput,
  value,
  className,
  children,
}: InputLabelProps) => {
  return (
    <label
      htmlFor={forInput}
      className={`block text-sm font-medium text-gray-700 ` + className}
    >
      {value ? value : children}
    </label>
  );
};

export default InputLabel;
