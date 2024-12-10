/* eslint-disable react/prop-types */
import './Toast.css';

function Toast({ message, type, onClose }) {
  return (
    <div className={`toast ${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;
