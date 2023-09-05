import * as React from "react";

interface IProps {
  label?: string;
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const Field: React.FC<IProps> = ({ className, children, label, id }) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
    )}
    {children}
  </div>
);

export default Field;
