import React, { useMemo } from "react";
import { ReducerAction } from "../reducer";

interface IFormContext {
  dispatch: React.Dispatch<ReducerAction>;
}

export const FormContext = React.createContext<IFormContext>({} as IFormContext);

interface Props {
  children: React.ReactNode;
  dispatch: React.Dispatch<ReducerAction>;
}

export const FormContextProvider: React.FC<Props> = ({ children, dispatch }) => {
  const value = useMemo(() => ({ dispatch }), [dispatch]);
  return <FormContext.Provider value={value} children={children} />;
};
