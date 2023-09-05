import { useContext } from "react";
import { FormContext } from "./FormContext";

export const useFormDispatch = () => useContext(FormContext).dispatch;
