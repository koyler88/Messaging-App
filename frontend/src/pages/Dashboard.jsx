import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/dashboard/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Remove the logged-in user
        setUsers(res.data.users.filter(u => u.id !== user.id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [token, user.id]);

  const startChat = (userId) => {
    navigate(`/messages/${userId}`);
  };

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <h2>Start a chat:</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.username}{" "}
            <button onClick={() => startChat(u.id)}>Chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
