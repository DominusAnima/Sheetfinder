import cx from "classnames";
import * as React from "react";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
  <button className={cx("Button", className)} {...props} />
);

export default Button;
