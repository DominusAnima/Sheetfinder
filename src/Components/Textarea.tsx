import cx from "classnames";
import * as React from "react";
import { baseInputClassName } from "./Input";

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea className={cx(baseInputClassName, className)} {...props} />
);

export default Textarea;
