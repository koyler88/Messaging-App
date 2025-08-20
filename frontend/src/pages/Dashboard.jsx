import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = "http://localhost:3000";

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const startChat = (userId) => {
    navigate(`/messages/${userId}`);
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="dashboard">
      <h1>Users</h1>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <span>{user.username}</span>
            <button onClick={() => startChat(user.id)}>Message</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
