import React from "react";
import "../index.scss";

interface Props {
  show: boolean;
  onOk: () => void;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

export default function Modal({ show, onOk, onClose, title, children }: Props) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button onClick={onOk} className="modal-button modal-ok-button">
            Ok
          </button>
          <button onClick={onClose} className="modal-button modal-close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
