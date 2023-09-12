import cx from "classnames";
import * as React from "react";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: "small" | "default"; block?: boolean }
> = ({ className, size = "default", block, ...props }) => (
  <button
    className={cx(
      "appearance-none text-gray-900 border border-gray-300 bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500",
      {
        "p-2 rounded-lg": size === "default",
        "p-0 px-2 text-sm rounded-md": size === "small",
        "block w-full": block,
      },
      className
    )}
    {...props}
  />
);

export default Button;
