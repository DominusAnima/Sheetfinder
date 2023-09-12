import cx from "classnames";
import * as React from "react";

export const baseInputClassName =
  "appearance-none block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input className={cx(baseInputClassName, className)} {...props} />
);

export default Input;
