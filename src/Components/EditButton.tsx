import * as React from "react";
import { FaEdit, FaTimesCircle } from "react-icons/fa";
import Button from "./Button";

const EditButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { editing?: boolean }> = ({
  editing,
  ...props
}) => <Button {...props}>{editing === true ? <FaTimesCircle /> : <FaEdit />}</Button>;

export default EditButton;
