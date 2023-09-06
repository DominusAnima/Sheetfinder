import cx from "classnames";
import * as React from "react";

const FlatButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
  <button className={cx("appearance-none cursor-pointer", className)} {...props} />
);

export default FlatButton;
