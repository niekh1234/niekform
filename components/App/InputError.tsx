type InputErrorProps = {
  message?: string;
  className?: string;
};

const InputError = ({ message, className = '' }: InputErrorProps) => {
  return message ? (
    <p className={'text-sm text-red-600 ' + className}>{message}</p>
  ) : null;
};

export default InputError;
