/* eslint-disable react/prop-types */
import "./UserPage.css";

export default function UserPage({ users, currentUser }) {
  const loggedInUsers = JSON.parse(
    localStorage.getItem("loggedInUsers") || "[]"
  );

  return (
    currentUser && (
      <section className="user-container">
        <h1 className="user-header">Users</h1>
        <div className="user-list">
          {users
            .filter((user) => user.username !== currentUser.username)
            .map((user) => (
              <div key={user._id} className="user-card">
                <div
                  className={`status-circle ${
                    loggedInUsers.some(
                      (loggedInUser) =>
                        loggedInUser.username === user.username &&
                        Date.now() - loggedInUser.lastLogin <= 3600000
                    )
                      ? "online"
                      : "offline"
                  }`}
                ></div>
                <h2 className="username">{user.username}</h2>
              </div>
            ))}
        </div>
      </section>
    )
  );
}
