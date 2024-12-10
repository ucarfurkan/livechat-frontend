/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
import ChatBox from "../../components/Chatbox/Chatbox";
import Messages from "../../components/Messages/Messages";
import "./Chat.css";
import ApiService from "../../service/apiService";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import Toast from "../../components/Toast/Toast";
import { ToastContext } from "../../contexts/ToastContext";
import UserPage from "../UserPage/UserPage";
import Navbar from "../Navbar/Navbar";

/**
 * Chat component for real-time messaging
 * @component
 * @returns {JSX.Element} Rendered Chat component
 * 
 * Features:
 * - Real-time messaging with WebSocket
 * - User authentication 
 * - Message history
 * - Responsive design
 * - User management
 * - Notifications
 */

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { toast, setToast, sendToastMessage } = useContext(ToastContext);
  const { userId, setUserId } = useContext(UserContext);
  const [isNewLogin, setIsNewLogin] = useState(false);
  const ws = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserPage, setShowUserPage] = useState(false);

  useEffect(() => {
    /**
     * Checks user authentication and loads user data.
     * Redirects to login if token is invalid.
     */
    const initialize = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const { parsedUserId, isTokenExpired } = await parseToken(token);
        if (isTokenExpired) {
          sendToastMessage("Token expired. Please log in again.", "fail");
          onLogout();
        } else if (parsedUserId) {
          await getCurrentUser(parsedUserId);
        }
      } else {
        sendToastMessage("No token found. Please log in.", "fail");
        navigate("/");
      }
    };
    getUsers();
    initialize();
    getMessages();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      console.log(event.data);

      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [isNewLogin]);

  /**
   * Handles WebSocket messages, users and updates state based on message and user type
   * @param {Object} message - Message containing type and data
   */
  const handleWebSocketMessage = (message) => {
    let loggedInUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || [];
    let existingUserIndex = -1;
    switch (message.type) {
      case "new_message":
        setMessages((prev) => [...prev, message.data]);
        break;
      case "changed_message":
        setMessages((prev) =>
          prev.map((msg) => (msg._id === message.data._id ? message.data : msg))
        );
        break;
      case "deleted_message":
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== message.data._id)
        );
        break;
      case "user_deleted":
        setUsers((prev) => prev.filter((user) => user._id !== message.data));
      case "new_login":
        loggedInUsers =
          JSON.parse(localStorage.getItem("loggedInUsers")) || [];

        existingUserIndex = loggedInUsers.findIndex(
          (user) => user.username === message.data.username
        );

        if (existingUserIndex !== -1) {
          loggedInUsers[existingUserIndex].lastLogin = Date.now();
        } else {
          loggedInUsers.push({
            username: message.data.username,
            lastLogin: Date.now(),
          });
        }
        loggedInUsers.push({
          username: message.data.username,
          lastLogin: Date.now(),
        });
        localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers));
        setIsNewLogin(!isNewLogin);
        break;
      
      case "changed_user":
        
        loggedInUsers =
        JSON.parse(localStorage.getItem("loggedInUsers")) || [];

        existingUserIndex = loggedInUsers.findIndex(
          (user) => user.username === message.data.username
        );

      if (existingUserIndex !== -1) {
        loggedInUsers[existingUserIndex].lastLogin = Date.now();
      } else {
        loggedInUsers.push({
          username: message.data.username,
          lastLogin: Date.now(),
        });
      }

      localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers));
      getUsers();

      default:
        console.error("Unknown WebSocket message type:", message.type);
    }
  };

  /**
   * Handles user logout action
   */
  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    sendToastMessage("Logged out successfully", "success");
  };

  /**
   * Updates user information
   * @param {Object} form User data with id, username and password
   */
  async function updateUser(form) {
    try {
      const res = await ApiService.updateUser(
        form.id,
        form.username,
        form.password
      );
      if (res.ok) {
        await getCurrentUser(form.id);
        sendToastMessage("User updated successfully", "success");
      }
    } catch (error) {
      sendToastMessage("An error occured when updating the user.", "fail");
    }
  }

  /**
   * Gets current user data
   * @param {string} userId
   */
  async function getCurrentUser(userId) {
    try {
      const userResponse = await ApiService.getUserById(userId);
      if (userResponse.ok) {
        const user = await userResponse.json();
        setCurrentUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets all users from the server
   */
  async function getUsers() {
    try {
      const userResponse = await ApiService.getUsers();
      if (userResponse.ok) {
        const users = await userResponse.json();
        setUsers(users);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Sends a new message through the API and updates the messages list
   * @param {Event} e - Form submission event
   */
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      if (!newMessage) {
        return;
      }
      const res = await ApiService.sendMessage(newMessage);
      const message = await res.json();
      if (res.ok) {
        sendToastMessage("Message sent successfully", "success");
      }
      setMessages([...messages, message]);
      setNewMessage("");
    } catch (error) {
      sendToastMessage("An error occured when sending the message.", "fail");
    }
  };

  /**
   * Gets all messages from the server
   */
  async function getMessages() {
    try {
      const response = await ApiService.getMessages();
      if (response.ok) {
        const messages = await response.json();
        setMessages(messages);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Parses a JWT token to get user ID and check if it's expired
   * @param {string} token - JWT token
   * @returns {Object} User ID and expiration status
   */
  async function parseToken(token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const isTokenExpired = payload.exp && payload.exp < currentTimestamp;
      setUserId(payload.userId);

      return {
        parsedUserId: payload.userId,
        isTokenExpired,
      };
    } catch (error) {
      console.error("Failed to parse token:", error);
      return { userId: null, isTokenExpired: true };
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile threshold
    };

    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize); // Update on resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onHamburgerClick = () => {
    setShowUserPage((prev) => !prev);
  };

  return (
    users &&
    currentUser && (
      <>
        <Navbar
          onLogout={onLogout}
          onUpdateUser={updateUser}
          currentUser={currentUser}
          onHamburgerClick={onHamburgerClick}
        />
        <section
          className={`chat-container ${
            showUserPage ? "show-user-page" : "show-chat-box"
          }`}
        >
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 1000,
            }}
          >
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </div>
          {isMobile ? (
            showUserPage ? (
              <UserPage users={users} currentUser={currentUser} />
            ) : (
              <div className="chat-box-container">
                <Messages messages={messages} username={currentUser.username} />
                <ChatBox
                  onSubmit={sendMessage}
                  onChange={setNewMessage}
                  value={newMessage}
                />
              </div>
            )
          ) : (
            <>
              <UserPage users={users} currentUser={currentUser} />
              <div className="chat-box-container">
                <Messages messages={messages} username={currentUser.username} />
                <ChatBox
                  onSubmit={sendMessage}
                  onChange={setNewMessage}
                  value={newMessage}
                />
              </div>
            </>
          )}
        </section>
      </>
    )
  );
}
