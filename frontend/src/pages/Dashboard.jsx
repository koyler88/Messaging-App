import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/dashboard/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Remove the current user from the list
        setUsers(res.data.users.filter((u) => u.id !== user.id));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username}{" "}
            <button onClick={() => navigate(`/messages?with=${u.id}`)}>
              Message
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
