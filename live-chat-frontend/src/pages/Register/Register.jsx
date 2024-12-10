import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import Toast from "../../components/Toast/Toast";
import ApiService from "../../service/apiService";
import {ToastContext} from "../../contexts/ToastContext";
import "./Register.css";

export default function Register() {
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

  function switchToLogin() {
    navigate("/");
  }

  /**
   * Handles registration form submission.
   * Shows success/error toast and redirects on success.
   * @param {Event} event - Form submission event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await ApiService.registerUser(username, password);

      if (response.ok) {
        setToast({
          message: "Register successful! You will be redirected to login page",
          type: "success",
        });

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      setToast({message: "Register failed. Please try again.", type: "fail"});
      console.error(error);
    }
  }

  return (
    <section className="container">
      <div
        style={{position: "fixed", top: "20px", right: "20px", zIndex: 1000}}
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
          Register
        </button>
        <div className="text-center">
          <div>
            Already a member?
            <button className="link-btn" type="button" onClick={switchToLogin}>
              Login Here
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
