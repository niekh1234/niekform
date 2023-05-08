import { useState } from 'react';

type CopyButtonProps = {
  value: string;
  className?: string;
};

const CopyButton = ({ value, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy} className={className}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton;
