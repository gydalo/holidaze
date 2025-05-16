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
      <div>
        {title && <h2>{title}</h2>}
        <p>{message}</p>
        <div className="">
          <ReusableButton onClick={onConfirm}>Yes, Delete</ReusableButton>
          <ReusableButton onClick={onCancel}>Cancel</ReusableButton>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
