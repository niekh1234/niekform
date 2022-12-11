import { classNames } from 'lib/client/utils';
import React from 'react';
import Spinner from 'components/App/Spinner';

type ButtonProps = {
  type?: 'submit' | 'button' | 'reset';
  className?: string;
  isSecondary?: boolean;
  processing?: boolean;
  children: React.ReactNode;
  onClick?: any;
};

const Button = ({
  type = 'submit',
  className = '',
  isSecondary = false,
  processing = false,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick ? onClick : null}
      type={type}
      className={classNames(
        isSecondary ? 'btn-secondary' : 'btn-primary',
        processing && 'opacity-25',
        className
      )}
      disabled={processing}
      {...props}
    >
      {processing ? <Spinner radius={16}></Spinner> : children}
    </button>
  );
};

export default Button;
