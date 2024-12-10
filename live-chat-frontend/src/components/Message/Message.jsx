/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import "./Message.css";
import { ToastContext } from "../../contexts/ToastContext";
import ApiService from "../../service/apiService";
import UpdateMessageModal from "../../pages/UpdateMessage/UpdateMessageModal";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import DeleteMessageModal from "../../pages/DeleteMessage/DeleteMessageModal";

export default function Message({ message }) {
  const { sendToastMessage } = useContext(ToastContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);

  /**
   * Formats a given timestamp to a time string in the "Europe/Zurich" timezone.
   *
   * @param {string|number|Date} timestamp - The timestamp to format.
   * @returns {string|null} The formatted time string in "hh:mm AM/PM" format, or null if the timestamp is invalid.
   */
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;

    try {
      const date = new Date(timestamp);

      const formattedTime = new Date(
        date.toLocaleString("en-US", { timeZone: "Europe/Zurich" })
      );

      return formattedTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return null;
    }
  };

  /**
   * Updates a message by sending a request to the API service.
   *
   * @param {Object} updatedMessage - The updated message content.
   */
  const onUpdateMessage = async (updatedMessage) => {
    try {
      const response = await ApiService.updateMessage(
        message._id,
        updatedMessage
      );
      if (response.ok) {
        await response.json();
        sendToastMessage("Message updated successfully", "success");
      }
    } catch (error) {
      sendToastMessage("An error occurred when updating the message.", "fail");
    }
  };

  /**
   * Deletes a message and shows a toast notification based on the result.
   */
  const onDeleteMessage = async () => {
    try {
      const response = await ApiService.deleteMessage(message._id);
      if (response.ok) {
        await response.json();
        sendToastMessage("Message deleted successfully", "success");
      }
    } catch (error) {
      sendToastMessage("An error occurred when deleting the message.", "fail");
    }
  };

  return (
    <>
      <div
        className={
          message.senderIsMe ? "text-right message-container" : "text-left"
        }
      >
        {message.senderIsMe && isButtonsVisible && (
          <div className="button-container mr-5">
            <button
              className="update-button hover"
              onClick={() => setIsModalOpen(true)}
            >
              <FiEdit />
            </button>
            <button
              className="delete-button hover"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <MdDeleteForever />
            </button>
          </div>
        )}
        <div
          className={`message-bubble hover ${
            message.senderIsMe ? "sent" : "received"
          }`}
          onClick={() => setIsButtonsVisible(!isButtonsVisible)}
        >
          <div className="message-content">
            {message.senderIsMe == false && (
              <div className="username" style={{ color: message.color }}>
                {message.username}
              </div>
            )}
            <p className="message-text">{message.message}</p>
            {message.createdAt && (
              <span
                className={`message-timestamp ${
                  message.senderIsMe ? "" : "received"
                }`}
              >
                {formatTimestamp(message.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
      <UpdateMessageModal
        isOpen={isModalOpen}
        currentMessage={message.message}
        onClose={() => setIsModalOpen(false)}
        onUpdateMessage={onUpdateMessage}
      />
      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteMessage={onDeleteMessage}
        text="Are you sure you want to delete this message?"
      />
    </>
  );
}
