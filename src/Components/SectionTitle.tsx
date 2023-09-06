import * as React from "react";

interface IProps {
  title: string;
  children?: React.ReactNode;
}

const SectionTitle: React.FC<IProps> = ({ title, children }) => (
  <h2 className="border-b-2 border-primary-800 text-primary-800">
    {title}
    {children && <div className="float-right">{children}</div>}
  </h2>
);

export default SectionTitle;
