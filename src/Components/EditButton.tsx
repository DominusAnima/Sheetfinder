import * as React from "react";
import { FaEdit, FaTimesCircle } from "react-icons/fa";
import FlatButton from "./FlatButton";

const EditButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { editing?: boolean }> = ({
  editing,
  ...props
}) => <FlatButton {...props}>{editing === true ? <FaTimesCircle /> : <FaEdit />}</FlatButton>;

export default EditButton;
