/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./UpdateUserModal.css";

export default function UpdateUserModal({
  isOpen,
  currentUser,
  onClose,
  onUpdateUser,
}) {
  const initialFormData = {
    id: currentUser._id,
    username: currentUser.username || "",
    password: "",
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        id: currentUser._id || "",
        username: currentUser.username || "",
        password: "",
      });
    }
  }, [currentUser]);

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles the user update operation by submitting form data, resetting the form,
   * and closing the modal.
   */
  const handleUpdate = () => {
    onUpdateUser(formData);
    setFormData(initialFormData);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    currentUser && (
      <dialog className="modal">
        <div className="modal-content">
          <h2>Update Your Information</h2>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
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
