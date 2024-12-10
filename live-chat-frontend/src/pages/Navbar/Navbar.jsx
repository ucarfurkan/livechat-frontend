/* eslint-disable react/prop-types */
import { FiEdit, FiLogOut } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import UpdateUserModal from "../UpdateUser/UpdateUserModal";
import DeleteMessageModal from "../DeleteMessage/DeleteMessageModal";
import ApiService from "../../service/apiService";
import { ToastContext } from "../../contexts/ToastContext";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import "./Navbar.css";

export default function Navbar({
  onLogout,
  onUpdateUser,
  currentUser,
  onHamburgerClick,
}) {
  const navigate = useNavigate();
  const { sendToastMessage } = useContext(ToastContext);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);

  /**
   * Deletes the current user and handles the response.
   * 
   * Sends a request to delete the current user. If successful, shows a success message,
   * removes the token, and navigates to the home page. Shows an error message if it fails.
   */
  const onDeleteMessage = async () => {
    try {
      const response = await ApiService.deleteUser(currentUser._id);
      if (response.ok) {
        await response.json();
        sendToastMessage("User deleted successfully", "success");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      sendToastMessage("An error occurred when deleting the user.", "fail");
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-header">
        <button className="hamburger-menu" onClick={onHamburgerClick}>
          <RxHamburgerMenu />
        </button>
        <span className="current-user">Welcome, {currentUser.username}</span>
        <div className="button-container">
          <button
            className="update-button"
            onClick={() => setIsUpdateModelOpen(true)}
          >
            <FiEdit />
          </button>
          <button
            className="delete-button"
            onClick={() => setIsDeleteModelOpen(true)}
          >
            <AiOutlineClose />
          </button>
          <button className="logout-button" onClick={onLogout}>
            <FiLogOut />
          </button>
        </div>
      </div>
      <UpdateUserModal
        isOpen={isUpdateModelOpen}
        currentUser={currentUser}
        onClose={() => setIsUpdateModelOpen(false)}
        onUpdateUser={onUpdateUser}
      />
      <DeleteMessageModal
        isOpen={isDeleteModelOpen}
        onClose={() => setIsDeleteModelOpen(false)}
        onDeleteMessage={onDeleteMessage}
        text={"Are you sure you want to delete your account?"}
      />
    </nav>
  );
}
