import ReusableButton from "../ReusableButton";
import Modal from "../common/PopUp";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="">
        {title && <h2 className="">{title}</h2>}
        <p className="">{message}</p>
        <div className="">
          <ReusableButton onClick={onConfirm} className="">
            Yes, Delete
          </ReusableButton>
          <ReusableButton onClick={onCancel} className="">
            Cancel
          </ReusableButton>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;