import cx from "classnames";
import * as React from "react";

const InlineInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={cx("w-full appearance-none inline-block p-0 text-sm text-center border border-slate-400 m-0", className)}
    {...props}
  />
);

export default InlineInput;
