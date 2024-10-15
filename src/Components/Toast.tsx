import React from "react";
import "../index.scss"; // Make sure to create a corresponding CSS file for styling

interface Props {
  type: "success" | "error" | "info";
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ type, message, duration = 3000, onClose }: Props) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  switch (type) {
    case "success":
      return (
        <div className="toast toast-success">
          <p>{message}</p>
        </div>
      );
    case "error":
      return (
        <div className="toast toast-error">
          <p>{message}</p>
        </div>
      );
    case "info":
      return (
        <div className="toast toast-info">
          <p>{message}</p>
        </div>
      );
    default:
      return null;
  }
}
