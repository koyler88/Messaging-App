import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/dashboard/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username}!</h1>
      <h2>Users you can chat with:</h2>
      <div className="user-list">
        {users.length === 0 && <p>No other users found.</p>}
        {users.map((u) => (
          <div key={u.id} className="user-card">
            <p>{u.username}</p>
            <button
              onClick={() => {
                // Redirect to messages page with this user
                window.location.href = `/messages?with=${u.id}`;
              }}
            >
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
