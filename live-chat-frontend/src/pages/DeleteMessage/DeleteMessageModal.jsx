/* eslint-disable react/prop-types */
import "./DeleteMessageModal.css";

export default function DeleteMessageModal({
  isOpen,
  onClose,
  onDeleteMessage,
  text,
}) {
  
  /**
   * Handles the deletion of a message.
   * Calls the onDeleteMessage function to delete the message,
   * and then calls the onClose function to close the modal.
   */
  const handleDelete = () => {
    onDeleteMessage();  
    onClose();  
  };

  const handleClose = () => {
    onClose();  
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{text}</h2>
        <div className="modal-actions">
          <button onClick={handleDelete}>Yes, Delete</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
