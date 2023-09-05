import * as React from "react";

interface IProps {
  children: React.ReactNode;
}

const Container: React.FC<IProps> = (props) => {
  return <div className="container mx-auto px-4" {...props} />;
};

export default Container;
