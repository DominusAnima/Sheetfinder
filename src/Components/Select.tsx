import cx from "classnames";
import * as React from "react";
import { baseInputClassName } from "./Input";

const Select: React.FC<React.InputHTMLAttributes<HTMLSelectElement>> = ({ className, ...props }) => (
  <select className={cx(baseInputClassName, className)} {...props} />
);

export default Select;
