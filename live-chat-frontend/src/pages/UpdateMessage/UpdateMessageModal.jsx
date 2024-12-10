/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./UpdateMessageModal.css";

export default function UpdateMessageModal({
  isOpen,
  currentMessage,
  onClose,
  onUpdateMessage,
}) {
  
  const initialFormData = currentMessage || "";
  const [messageBody, setMessageBody] = useState(initialFormData);
  useEffect(() => {
    if (currentMessage) {
      setMessageBody(currentMessage || "");
    }
  }, [currentMessage]);



  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessageBody(value);
  };

  /**
   * Handles the update operation for a message.
   * Updates the message with the current message body, resets the form to initial state,
   * and closes the modal.
   */
  const handleUpdate = () => {
    onUpdateMessage(messageBody);
    setMessageBody(initialFormData);
    onClose();
  };

  const handleClose = () => {
    setMessageBody(initialFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    currentMessage && (
      <dialog className="modal">
        <div className="modal-content">
          <h2>Update Message</h2>
          <label>
            Update your message:
            <input
              type="text"
              name="messageBody"
              value={messageBody}
              onChange={handleInputChange}
            />
          </label>
          <div className="modal-actions">
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </dialog>
    )
  );
}
