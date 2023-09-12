import cx from "classnames";
import * as React from "react";

interface IProps {
  label?: string;
  id?: string;
  children?: React.ReactNode;
  className?: string;
  horizontal?: boolean;
}

const Field: React.FC<IProps> = ({ className, children, label, id, horizontal }) => (
  <div className={cx(className, { "flex items-center": horizontal })}>
    {label && (
      <label
        htmlFor={id}
        className={cx("block text-sm font-medium text-gray-900", {
          "mb-2": !horizontal,
          "flex-shrink-0 w-52": horizontal,
        })}
      >
        {label}
      </label>
    )}
    {children}
  </div>
);

export default Field;
