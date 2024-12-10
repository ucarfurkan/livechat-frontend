/* eslint-disable no-undef */
import { useEffect, useState, useContext } from "react";
import Toast from "../../components/Toast/Toast";
import { useNavigate } from "react-router";
import ApiService from "../../service/apiService";
import { UserContext } from "../../contexts/UserContext";
import { ToastContext } from "../../contexts/ToastContext";
import "./Login.css";

export default function Login() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/chat";
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {toast, setToast} = useContext(ToastContext);
  const navigate = useNavigate();
  const { setUserId } = useContext(UserContext);

  function switchToRegister() {
    navigate("/register");
  }

  
  /**
   * Handles login form submission, authenticates user, and manages login state.
   * @param {Event} event - Form submission event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await ApiService.loginUser(username, password);

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        setUserId(data.userId);

        localStorage.setItem("token", token);

        setToast({ message: "Login successful!", type: "success" });

        navigate("/chat");
      } else {
        setToast({ message: "Login failed. Please try again.", type: "fail" });
      }
    } catch (error) {
      setToast({ message: "Login failed. Please try again.", type: "fail" });
      console.error(error);
    }
  }

  return (
    <section className="container">
      <div
        style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}
      >
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="input"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="input"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn">
          Log in
        </button>
        <div className="text-center">
          <div>
            Not a member?
            <button
              className="link-btn"
              type="button"
              onClick={switchToRegister}
            >
              Register here
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
