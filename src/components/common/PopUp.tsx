import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
   
        <img
          className="w-32 justify-center mx-auto mb-8"
          src="/public/assets/images/holidaze-logo-slogan.png"
          alt="Logo"
        />

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
          aria-label="Close"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
