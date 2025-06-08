'use client';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <div className="text-error p-4 bg-red-100 rounded">{message}</div>;
};

export default ErrorMessage;