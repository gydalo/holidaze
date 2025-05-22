import ReusableButton from "../ReusableButton";
import Modal from "../common/PopUp";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="text-center p-4">
        {title && <h2 className="text-xl  mb-6">{title}</h2>}
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <ReusableButton onClick={onConfirm}>Yes, Delete</ReusableButton>
          <ReusableButton onClick={onCancel}>Cancel</ReusableButton>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
